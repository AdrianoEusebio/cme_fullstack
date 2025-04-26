from rest_framework import serializers
from cme_api.models import UserGroup

class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = ['id', 'group_desc', 'permission1', 'permission2', 'permission3']
        read_only_fields = ['id']

    