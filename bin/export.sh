#!/usr/bin/env bash

DOT_ENV="$1"
EXEC=${@:2}

set -a
source $DOT_ENV
set +a

$EXEC