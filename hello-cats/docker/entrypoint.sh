#!/bin/sh
if [ "${RUN_AS_INIT_CONTAINER}" = "true" ]
then
    pnpm run ci:db:migrate
else
    node index
fi
