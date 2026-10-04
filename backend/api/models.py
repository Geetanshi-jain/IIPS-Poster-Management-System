from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('reviewer', 'Reviewer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    is_published = models.BooleanField(default=False)
    criteria_list = models.JSONField(default=list) # List of criteria strings
    results_published = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class EventDomain(models.Model):
    name = models.CharField(max_length=100)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='domains')

    def __str__(self):
        return self.name

class EventRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    registration_date = models.DateTimeField(auto_now_add=True)

class Poster(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('REVISION_REQUESTED', 'Revision Requested'),
        ('RESUBMITTED', 'Resubmitted'),
        ('EVALUATED', 'Evaluated'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('FINALIZED', 'Finalized'),
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='posters')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posters')
    title = models.CharField(max_length=200)
    abstract = models.TextField()
    file_url = models.URLField(blank=True, null=True)
    pdf_file = models.FileField(upload_to='posters/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    def __str__(self):
        return self.title

class PosterAuthor(models.Model):
    poster = models.ForeignKey(Poster, on_delete=models.CASCADE, related_name='co_authors')
    name = models.CharField(max_length=100)
    email = models.EmailField()

class RubricCriterion(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='criteria')
    name = models.CharField(max_length=100)
    max_score = models.IntegerField(default=10)
    weight = models.FloatField(default=1.0)

    def __str__(self):
        return self.name

class ReviewAssignment(models.Model):
    poster = models.ForeignKey(Poster, on_delete=models.CASCADE, related_name='assignments')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    assigned_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='ASSIGNED')

class Evaluation(models.Model):
    assignment = models.OneToOneField(ReviewAssignment, on_delete=models.CASCADE, related_name='evaluation')
    total_score = models.FloatField(default=0.0)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class EvaluationDetail(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='details')
    criterion = models.ForeignKey(RubricCriterion, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    comment = models.TextField(blank=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
