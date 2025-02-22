#!/bin/bash
rm -r sapien.egg-info
rm wheelhouse/*.whl
if [ -z ${VERSION} ]
then
    echo VERSION variable is not specified
    VERSION=2.0.0.dev$(date +"%Y%m%d")
    echo VERSION defatuls to ${VERSION}
    sleep 3
fi

docker run -v `pwd`:/workspace/SAPIEN -it --rm \
       -u $(id -u ${USER}):$(id -g ${USER}) \
       fxiangucsd/sapien-build-env:latest bash -c "cd /workspace/SAPIEN && ./build.sh 38 --debug"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd wheelhouse
pip3 uninstall -y sapien
pip3 install *

cd /tmp && rm stubs -rf && pybind11-stubgen sapien.core --ignore-invalid all
cp /tmp/stubs/sapien/core-stubs/__init__.pyi $DIR/python/py_package/core
cp -r /tmp/stubs/sapien/core-stubs/pysapien $DIR/python/py_package/core
