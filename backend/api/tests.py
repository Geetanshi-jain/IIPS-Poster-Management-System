from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Poster

class EventAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(username='admin', email='admin@test.com', password='password123', role='admin')
        self.student_user = User.objects.create_user(username='student', email='student@test.com', password='password123', role='student')
        
    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
        
    def test_create_event_as_admin(self):
        url = reverse('event-list')
        data = {
            'title': 'Annual Research Symposium',
            'description': 'A great event.',
            'start_date': '2026-11-01',
            'end_date': '2026-11-02',
            'is_published': True
        }
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.get_token(self.admin_user))
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 1)
        self.assertEqual(Event.objects.get().title, 'Annual Research Symposium')
        
    def test_create_event_as_student(self):
        url = reverse('event-list')
        data = {
            'title': 'Unauthorized Event',
            'description': 'A bad event.',
            'start_date': '2026-11-01',
            'end_date': '2026-11-02',
            'is_published': True
        }
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.get_token(self.student_user))
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Event.objects.count(), 0)

class PosterAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username='student2', email='student2@test.com', password='password123', role='student')
        self.admin_user = User.objects.create_user(username='admin2', email='admin2@test.com', password='password123', role='admin')
        self.event = Event.objects.create(title='Test Event', description='Desc', start_date='2026-11-01', end_date='2026-11-02')

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_submit_poster_as_student(self):
        url = reverse('poster-list')
        data = {
            'event': self.event.id,
            'title': 'AI in Healthcare',
            'abstract': 'An abstract about AI.',
            'status': 'SUBMITTED'
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.get_token(self.student_user))
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Poster.objects.count(), 1)
        self.assertEqual(Poster.objects.get().author, self.student_user)
        
    def test_submit_poster_as_admin(self):
        url = reverse('poster-list')
        data = {
            'event': self.event.id,
            'title': 'Admin Poster',
            'abstract': 'Admins should not post.',
            'status': 'SUBMITTED'
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.get_token(self.admin_user))
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Poster.objects.count(), 0)
