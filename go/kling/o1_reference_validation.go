package kling

import (
	"fmt"
	"net"
	"net/url"
	"path"
	"regexp"
	"strconv"
	"strings"
)

const o1Model = "kling-o1"

var (
	o1ImageExtensions  = map[string]bool{".jpg": true, ".jpeg": true, ".png": true}
	o1VideoExtensions  = map[string]bool{".mp4": true, ".mov": true}
	o1NoncanonicalIPv4 = regexp.MustCompile(`(?i)^(?:0x[0-9a-f]+|[0-9]+)(?:\.(?:0x[0-9a-f]+|[0-9]+)){0,3}$`)
	o1BlockedIPNets    = parseO1BlockedIPNets([]string{
		"0.0.0.0/8",
		"10.0.0.0/8",
		"100.64.0.0/10",
		"127.0.0.0/8",
		"169.254.0.0/16",
		"172.16.0.0/12",
		"192.0.0.0/24",
		"192.0.2.0/24",
		"192.88.99.0/24",
		"192.168.0.0/16",
		"198.18.0.0/15",
		"198.51.100.0/24",
		"203.0.113.0/24",
		"224.0.0.0/4",
		"240.0.0.0/4",
		"255.255.255.255/32",
		"::/128",
		"::1/128",
		"64:ff9b::/96",
		"64:ff9b:1::/48",
		"100::/64",
		"2001::/32",
		"2001:2::/48",
		"2001:db8::/32",
		"2002::/16",
		"3fff::/20",
		"fc00::/7",
		"fe80::/10",
		"ff00::/8",
	})
	o1ImageMarker = regexp.MustCompile(`<<<image_(\d+)>>>`)
	o1VideoMarker = regexp.MustCompile(`<<<video_([^>]+)>>>`)
)

func validateKlingO1References(body map[string]any) error {
	if body["model"] != o1Model {
		return nil
	}
	if body["enable_sound"] == true {
		return validationError("enable_sound is not supported by kling-o1")
	}

	for _, field := range []string{"first_frame_image_url", "last_frame_image_url"} {
		value, _ := body[field].(string)
		if value != "" && !isPublicHTTPURL(value) {
			return validationError(field + " must be a public HTTP or HTTPS URL")
		}
		if value != "" && !o1ImageExtensions[urlExtension(value)] {
			return validationError(field + " must use a JPG, JPEG, or PNG URL")
		}
	}

	prompt, _ := body["prompt"].(string)
	referenceImages, _ := body["reference_image_urls"].([]any)
	referenceVideoURL, _ := body["reference_video_url"].(string)
	if fieldPresent(body, "last_frame_image_url") && (len(referenceImages) > 0 || referenceVideoURL != "") {
		return validationError("last_frame_image_url cannot be combined with reference_image_urls or reference_video_url")
	}
	if referenceVideoURL != "" && len(referenceImages) > 4 {
		return validationError("reference_image_urls must contain at most 4 items when reference_video_url is present")
	}
	for index, raw := range referenceImages {
		imageURL, ok := raw.(string)
		if !ok {
			return validationError(fmt.Sprintf("reference_image_urls[%d] must be a string", index))
		}
		if !isPublicHTTPURL(imageURL) {
			return validationError(fmt.Sprintf("reference_image_urls[%d] must be a public HTTP or HTTPS URL", index))
		}
		if !o1ImageExtensions[urlExtension(imageURL)] {
			return validationError(fmt.Sprintf("reference_image_urls[%d] must use a JPG, JPEG, or PNG URL", index))
		}
		marker := fmt.Sprintf("<<<image_%d>>>", index+1)
		if !strings.Contains(prompt, marker) {
			return validationError(fmt.Sprintf("prompt must reference reference_image_urls[%d] as %s", index, marker))
		}
	}
	for _, match := range o1ImageMarker.FindAllStringSubmatch(prompt, -1) {
		index, _ := strconv.Atoi(match[1])
		if index < 1 || index > len(referenceImages) {
			return validationError(fmt.Sprintf("prompt references missing image_%d", index))
		}
	}

	if referenceVideoURL == "" {
		if _, ok := body["reference_video_type"]; ok {
			return validationError("reference_video_type requires reference_video_url")
		}
		if _, ok := body["preserve_reference_video_audio"]; ok {
			return validationError("preserve_reference_video_audio requires reference_video_url")
		}
		if match := o1VideoMarker.FindStringSubmatch(prompt); match != nil {
			return validationError(fmt.Sprintf("prompt references missing video_%s", match[1]))
		}
		return nil
	}
	if !isPublicHTTPURL(referenceVideoURL) {
		return validationError("reference_video_url must be a public HTTP or HTTPS URL")
	}
	if !o1VideoExtensions[urlExtension(referenceVideoURL)] {
		return validationError("reference_video_url must use an MP4 or MOV URL")
	}
	if !strings.Contains(prompt, "<<<video_1>>>") {
		return validationError("prompt must reference reference_video_url as <<<video_1>>>")
	}
	for _, match := range o1VideoMarker.FindAllStringSubmatch(prompt, -1) {
		if match[1] != "1" {
			return validationError("prompt may only reference video_1")
		}
	}

	referenceVideoType, _ := body["reference_video_type"].(string)
	if referenceVideoType == "" {
		referenceVideoType = "base"
	}
	if referenceVideoType == "base" && (fieldPresent(body, "first_frame_image_url") || fieldPresent(body, "last_frame_image_url")) {
		return validationError("reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url")
	}
	return nil
}

func urlExtension(value string) string {
	parsed, err := url.Parse(value)
	if err != nil {
		return ""
	}
	return strings.ToLower(path.Ext(parsed.Path))
}

func isPublicHTTPURL(value string) bool {
	parsed, err := url.Parse(value)
	if err != nil {
		return false
	}
	host := parsed.Hostname()
	return (parsed.Scheme == "http" || parsed.Scheme == "https") && host != "" && parsed.User == nil && !isBlockedO1Host(host)
}

func isBlockedO1Host(host string) bool {
	host = strings.TrimSuffix(strings.ToLower(host), ".")
	if host == "localhost" || strings.HasSuffix(host, ".localhost") {
		return true
	}
	ip := net.ParseIP(host)
	if ip == nil {
		return o1NoncanonicalIPv4.MatchString(host)
	}
	for _, network := range o1BlockedIPNets {
		if network.Contains(ip) {
			return true
		}
	}
	return false
}

func parseO1BlockedIPNets(cidrs []string) []*net.IPNet {
	networks := make([]*net.IPNet, 0, len(cidrs))
	for _, cidr := range cidrs {
		_, network, err := net.ParseCIDR(cidr)
		if err != nil {
			panic("invalid Kling O1 blocked IP range: " + cidr)
		}
		networks = append(networks, network)
	}
	return networks
}
