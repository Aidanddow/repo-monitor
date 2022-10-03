from rest_framework import serializers
from core.models import Repository, Commit, Branch, Developer, CustomUser



class CustomUserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

        read_only_fields = ['user']

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = '__all__'

class RepositorySerializer(serializers.ModelSerializer):
    developers = DeveloperSerializer(read_only=True, many=True)

    class Meta:
        model = Repository
        fields = '__all__'

class CommitSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)
    repo = RepositorySerializer(read_only=True)
    author =DeveloperSerializer(read_only=True)
    class Meta:
        model = Commit
        fields = '__all__'

class DevCommitSerializer(serializers.ModelSerializer):
    repo = serializers.IntegerField()
    author = serializers.IntegerField()
    # author =DeveloperSerializer(read_only=True)
    class Meta:
        model = Commit
        fields = ('commit_hash', 'message', 'repo', 'total_files', 'total_lines', 'author' )
        # depth = 1


class GraphSerializer(serializers.Serializer):
   
    count = serializers.IntegerField()
    sum = serializers.IntegerField()
    date__date = serializers.CharField(max_length = 200)

