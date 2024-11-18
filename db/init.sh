#!/bin/bash

MYSQL_USER="admin"
MYSQL_PASSWORD="12345"
MYSQL_HOST="localhost"
MYSQL_DATABASE="mydb"

mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -h$MYSQL_HOST $MYSQL_DATABASE < "$(dirname "$0")/init_roles.sql"
mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -h$MYSQL_HOST $MYSQL_DATABASE < "$(dirname "$0")/init_perms.sql"
mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -h$MYSQL_HOST $MYSQL_DATABASE < "$(dirname "$0")/init_r_p.sql"

mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -h$MYSQL_HOST $MYSQL_DATABASE < "$(dirname "$0")/create_admin.sql"

