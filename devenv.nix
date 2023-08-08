{ pkgs, ... }:

let
  root = builtins.getEnv "PWD";

  nodeCmds = cmds:
    builtins.listToAttrs (builtins.map (cmd: {
      name = cmd;
      value.exec = "exec yarn --silent ${cmd} $@";
    }) cmds);

  nodejs = pkgs.nodejs-16_x;
  yarn = pkgs.yarn.override { inherit nodejs; };

in {
  packages = with pkgs; [ git nodejs yarn ];

  #
  scripts = nodeCmds [ "ng" "ngserver" ];
}
