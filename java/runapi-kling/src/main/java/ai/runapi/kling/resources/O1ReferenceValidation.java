package ai.runapi.kling.resources;

import ai.runapi.core.errors.ValidationException;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class O1ReferenceValidation {
  private static final String MODEL = "kling-o1";
  private static final Set<String> IMAGE_EXTENSIONS =
      new HashSet<String>(Arrays.asList(".jpg", ".jpeg", ".png"));
  private static final Set<String> VIDEO_EXTENSIONS =
      new HashSet<String>(Arrays.asList(".mp4", ".mov"));
  private static final Pattern NONCANONICAL_IPV4_LITERAL = Pattern.compile(
      "(?:0x[0-9a-f]+|\\d+)(?:\\.(?:0x[0-9a-f]+|\\d+)){0,3}", Pattern.CASE_INSENSITIVE);
  private static final List<String> BLOCKED_IP_CIDRS = Arrays.asList(
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
      "ff00::/8");
  private static final Pattern IMAGE_MARKER = Pattern.compile("<<<image_(\\d+)>>>");
  private static final Pattern VIDEO_MARKER = Pattern.compile("<<<video_([^>]+)>>>");

  private O1ReferenceValidation() {}

  static void validate(Map<String, Object> body) {
    if (!MODEL.equals(body.get("model"))) {
      return;
    }
    if (Boolean.TRUE.equals(body.get("enable_sound"))) {
      throw new ValidationException("enable_sound is not supported by " + MODEL);
    }

    validateFrameUrls(body);
    String prompt = body.get("prompt") instanceof String ? (String) body.get("prompt") : "";
    List<?> referenceImages =
        body.get("reference_image_urls") instanceof List<?> ? (List<?>) body.get("reference_image_urls") : java.util.Collections.emptyList();
    String referenceVideoUrl =
        body.get("reference_video_url") instanceof String ? (String) body.get("reference_video_url") : null;

    if (present(body.get("last_frame_image_url"))
        && (!referenceImages.isEmpty() || present(referenceVideoUrl))) {
      throw new ValidationException(
          "last_frame_image_url cannot be combined with reference_image_urls or reference_video_url");
    }
    if (referenceVideoUrl != null && referenceImages.size() > 4) {
      throw new ValidationException(
          "reference_image_urls must contain at most 4 items when reference_video_url is present");
    }
    validateReferenceImages(prompt, referenceImages);
    validateReferenceVideo(body, prompt, referenceVideoUrl);
  }

  private static void validateFrameUrls(Map<String, Object> body) {
    for (String field : Arrays.asList("first_frame_image_url", "last_frame_image_url")) {
      Object value = body.get(field);
      if (value instanceof String && !((String) value).isEmpty() && !isPublicHttpUrl((String) value)) {
        throw new ValidationException(field + " must be a public HTTP or HTTPS URL");
      }
      if (value instanceof String && !((String) value).isEmpty()
          && !IMAGE_EXTENSIONS.contains(urlExtension((String) value))) {
        throw new ValidationException(field + " must use a JPG, JPEG, or PNG URL");
      }
    }
  }

  private static void validateReferenceImages(String prompt, List<?> urls) {
    for (int index = 0; index < urls.size(); index++) {
      if (!(urls.get(index) instanceof String)) {
        throw new ValidationException("reference_image_urls[" + index + "] must be a string");
      }
      String url = (String) urls.get(index);
      if (!isPublicHttpUrl(url)) {
        throw new ValidationException(
            "reference_image_urls[" + index + "] must be a public HTTP or HTTPS URL");
      }
      if (!IMAGE_EXTENSIONS.contains(urlExtension(url))) {
        throw new ValidationException(
            "reference_image_urls[" + index + "] must use a JPG, JPEG, or PNG URL");
      }
      String marker = "<<<image_" + (index + 1) + ">>>";
      if (!prompt.contains(marker)) {
        throw new ValidationException(
            "prompt must reference reference_image_urls[" + index + "] as " + marker);
      }
    }

    Matcher markers = IMAGE_MARKER.matcher(prompt);
    while (markers.find()) {
      int index = Integer.parseInt(markers.group(1));
      if (index < 1 || index > urls.size()) {
        throw new ValidationException("prompt references missing image_" + index);
      }
    }
  }

  private static void validateReferenceVideo(
      Map<String, Object> body, String prompt, String referenceVideoUrl) {
    if (referenceVideoUrl == null || referenceVideoUrl.isEmpty()) {
      if (body.containsKey("reference_video_type")) {
        throw new ValidationException("reference_video_type requires reference_video_url");
      }
      if (body.containsKey("preserve_reference_video_audio")) {
        throw new ValidationException("preserve_reference_video_audio requires reference_video_url");
      }
      Matcher missingMarker = VIDEO_MARKER.matcher(prompt);
      if (missingMarker.find()) {
        throw new ValidationException("prompt references missing video_" + missingMarker.group(1));
      }
      return;
    }
    if (!isPublicHttpUrl(referenceVideoUrl)) {
      throw new ValidationException("reference_video_url must be a public HTTP or HTTPS URL");
    }
    if (!VIDEO_EXTENSIONS.contains(urlExtension(referenceVideoUrl))) {
      throw new ValidationException("reference_video_url must use an MP4 or MOV URL");
    }
    if (!prompt.contains("<<<video_1>>>")) {
      throw new ValidationException("prompt must reference reference_video_url as <<<video_1>>>");
    }

    Matcher markers = VIDEO_MARKER.matcher(prompt);
    while (markers.find()) {
      if (!"1".equals(markers.group(1))) {
        throw new ValidationException("prompt may only reference video_1");
      }
    }

    Object type = body.get("reference_video_type");
    String referenceVideoType = type == null ? "base" : String.valueOf(type);
    if ("base".equals(referenceVideoType)
        && (present(body.get("first_frame_image_url")) || present(body.get("last_frame_image_url")))) {
      throw new ValidationException(
          "reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url");
    }
  }

  private static boolean present(Object value) {
    return value instanceof String ? !((String) value).trim().isEmpty() : value != null;
  }

  private static String urlExtension(String value) {
    try {
      String path = new URI(value).getPath();
      int dot = path == null ? -1 : path.lastIndexOf('.');
      return dot < 0 ? "" : path.substring(dot).toLowerCase(Locale.ROOT);
    } catch (URISyntaxException error) {
      return "";
    }
  }

  private static boolean isPublicHttpUrl(String value) {
    try {
      URI uri = new URI(value);
      return ("http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme()))
          && uri.getHost() != null && uri.getUserInfo() == null && !isBlockedHost(uri.getHost());
    } catch (URISyntaxException error) {
      return false;
    }
  }

  private static boolean isBlockedHost(String rawHost) {
    String host = rawHost.toLowerCase(Locale.ROOT);
    if (host.startsWith("[") && host.endsWith("]")) {
      host = host.substring(1, host.length() - 1);
    }
    if (host.endsWith(".")) {
      host = host.substring(0, host.length() - 1);
    }
    if ("localhost".equals(host) || host.endsWith(".localhost")) {
      return true;
    }

    byte[] address = parseIpLiteral(host);
    if (address == null) {
      return NONCANONICAL_IPV4_LITERAL.matcher(host).matches();
    }
    for (String cidr : BLOCKED_IP_CIDRS) {
      String[] parts = cidr.split("/", 2);
      byte[] network = parseIpLiteral(parts[0]);
      if (network != null
          && network.length == address.length
          && matchesCidr(address, network, Integer.parseInt(parts[1]))) {
        return true;
      }
    }
    return false;
  }

  private static byte[] parseIpLiteral(String host) {
    if (!host.contains(":") && !host.matches("\\d{1,3}(?:\\.\\d{1,3}){3}")) {
      return null;
    }
    try {
      return InetAddress.getByName(host).getAddress();
    } catch (UnknownHostException error) {
      return null;
    }
  }

  private static boolean matchesCidr(byte[] address, byte[] network, int prefix) {
    int fullBytes = prefix / 8;
    for (int index = 0; index < fullBytes; index++) {
      if (address[index] != network[index]) {
        return false;
      }
    }
    int remainingBits = prefix % 8;
    if (remainingBits == 0) {
      return true;
    }
    int mask = (0xff << (8 - remainingBits)) & 0xff;
    return (address[fullBytes] & mask) == (network[fullBytes] & mask);
  }
}
