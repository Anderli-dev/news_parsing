"""empty message

Revision ID: 1d8ff3d82cd2
Revises: 434e07455f07
Create Date: 2023-06-15 07:47:15.223240

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d8ff3d82cd2'
down_revision = '434e07455f07'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'news_preview', ['id'])
    op.add_column('role', sa.Column('description', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('role', 'description')
    op.drop_constraint(None, 'news_preview', type_='unique')
    # ### end Alembic commands ###
