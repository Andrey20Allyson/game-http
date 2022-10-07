if [ "$1" = "c" ] 
then
    echo "building [client]"
    tsc -p client

elif [ "$1" = "s" ] 
then
    echo "building [server]"
    tsc -p src

elif [ "$1" = "a" ] 
then
    echo "building [client]"
    tsc -p client
    echo "building [server]"
    tsc -p src

else
    echo "unknow sub-command"

fi

echo "running [server]"
node dist/index.js