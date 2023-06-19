"""Add name, surname and email fields to user model

Revision ID: 48484a3292ac
Revises: 1d8ff3d82cd2
Create Date: 2023-06-19 09:23:48.897356

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '48484a3292ac'
down_revision = '1d8ff3d82cd2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('name', sa.String(length=50), nullable=True))
    op.add_column('user', sa.Column('surname', sa.String(length=50), nullable=True))
    op.add_column('user', sa.Column('email', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'email')
    op.drop_column('user', 'surname')
    op.drop_column('user', 'name')
    # ### end Alembic commands ###
