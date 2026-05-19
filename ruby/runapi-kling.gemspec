# frozen_string_literal: true

Dir.chdir(__dir__) do

  Gem::Specification.new do |spec|
    spec.name = "runapi-kling"
    spec.version = "0.2.1"
    spec.authors = [ "RunAPI" ]
    spec.email = [ "contact@runapi.ai" ]

    spec.summary = "Kling API SDKs for JavaScript, Ruby, and Go on RunAPI."
    spec.description = "RunAPI Kling SDK for JavaScript, Ruby, and Go"
    spec.homepage = "https://runapi.ai/models/kling"
    spec.license = "Apache-2.0"
    spec.required_ruby_version = ">= 3.1.0"

    spec.metadata["homepage_uri"] = "https://runapi.ai/models/kling"
    spec.metadata["documentation_uri"] = "https://runapi.ai/models/kling"
    spec.metadata["source_code_uri"] = "https://github.com/runapi-ai/kling-sdk"
    spec.metadata["changelog_uri"] = "https://github.com/runapi-ai/kling-sdk/blob/main/CHANGELOG.md"

    spec.files = Dir.glob("lib/**/*") + %w[LICENSE]
    spec.require_paths = [ "lib" ]

    spec.add_dependency "runapi-core", "~> 0.1"
  end
end
