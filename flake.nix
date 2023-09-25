# https://github.com/numtide/devshell
{
  description = "nix is love, nix is life";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ ];
        pkgs = import nixpkgs {
          inherit system overlays;
          config = { permittedInsecurePackages = [ "nodejs-16.20.2" ]; };
        };

        PROJECT_ROOT = builtins.toString "$PWD";

        nodejs = pkgs.nodejs-16_x;
        yarn = pkgs.yarn.override { inherit nodejs; };
        npm = pkgs.npm.override { inherit npm; };

      in with pkgs; {
        devShells.default = mkShell {
          buildInputs = [ yarn nodejs ];
          shellHook = ''export PATH="$PATH:${PROJECT_ROOT}/node_modules/.bin"'';
        };
      });
}
