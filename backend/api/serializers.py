from rest_framework import serializers
from .models import User, Event, EventDomain, EventRegistration, Poster, PosterAuthor, RubricCriterion, ReviewAssignment, Evaluation, EvaluationDetail

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']

class EventDomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventDomain
        fields = ['id', 'name']

class EventSerializer(serializers.ModelSerializer):
    domains = EventDomainSerializer(many=True, read_only=True)
    class Meta:
        model = Event
        fields = '__all__'

class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = '__all__'

class PosterAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterAuthor
        fields = ['id', 'name', 'email']

class PosterSerializer(serializers.ModelSerializer):
    event_criteria = serializers.SerializerMethodField()
    
    def get_event_criteria(self, obj):
        return obj.event.criteria_list if obj.event else []

    co_authors = PosterAuthorSerializer(many=True, read_only=True)
    class Meta:
        model = Poster
        fields = '__all__'

class RubricCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubricCriterion
        fields = '__all__'

class ReviewAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewAssignment
        fields = '__all__'

class EvaluationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationDetail
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    details = EvaluationDetailSerializer(many=True, read_only=True)
    class Meta:
        model = Evaluation
        fields = '__all__'
