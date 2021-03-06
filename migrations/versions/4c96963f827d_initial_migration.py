"""Initial migration.

Revision ID: 4c96963f827d
Revises: 
Create Date: 2022-06-22 08:20:59.848605

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '4c96963f827d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('news', 'id',
               existing_type=mysql.INTEGER(),
               nullable=True,
               autoincrement=True)
    op.alter_column('news_preview', 'id',
               existing_type=mysql.INTEGER(),
               nullable=True,
               autoincrement=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('news_preview', 'id',
               existing_type=mysql.INTEGER(),
               nullable=False,
               autoincrement=True)
    op.alter_column('news', 'id',
               existing_type=mysql.INTEGER(),
               nullable=False,
               autoincrement=True)
    # ### end Alembic commands ###
