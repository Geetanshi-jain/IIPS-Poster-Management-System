from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register_user, name='register-user'),
    path('auth/me/', views.current_user, name='current-user'),
    
    path('events/', views.event_list, name='event-list'),
    path('events/<int:pk>/', views.event_detail, name='event-detail'),
    path('events/register/', views.register_event, name='register-event'),
    path('events/<int:pk>/rankings/', views.event_rankings, name='event-rankings'),
    path('events/<int:pk>/analytics/', views.event_analytics, name='event-analytics'),
    
    path('posters/', views.poster_list, name='poster-list'),
    path('posters/<int:pk>/', views.poster_detail, name='poster-detail'),
    
    path('reviewers/', views.reviewer_list, name='reviewer-list'),
    path('reviewers/bulk-assign/', views.bulk_assign_reviewers, name='bulk-assign-reviewers'),
    path('reviewers/assign/', views.assign_reviewer, name='assign-reviewer'),
    path('evaluations/submit/', views.submit_evaluation, name='submit-evaluation'),
]
