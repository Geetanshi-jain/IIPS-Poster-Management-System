from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import User, Event, EventRegistration, Poster, ReviewAssignment, Evaluation
from .serializers import EventSerializer, EventRegistrationSerializer, PosterSerializer, ReviewAssignmentSerializer, EvaluationSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    role = data.get('role', 'student')
    
    if role not in ['student', 'reviewer']:
        return Response({'detail': 'Invalid role specified.'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=data.get('username')).exists():
        return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create(
        username=data.get('username'),
        email=data.get('email'),
        password=make_password(data.get('password')),
        role=role
    )
    return Response({'detail': f'{role.capitalize()} registered successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'role': request.user.role
    })

@api_view(['GET', 'POST'])
def event_list(request):
    if request.method == 'GET':
        events = Event.objects.filter(is_published=True) if not (request.user.is_authenticated and request.user.role == 'admin') else Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'detail': 'Only administrators can create events.'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def event_detail(request, pk):
    event = get_object_or_404(Event, pk=pk)
    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data)
        
    if not request.user.is_authenticated or request.user.role != 'admin':
        return Response({'detail': 'Only administrators can modify events.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_event(request):
    if request.user.role != 'student':
        return Response({'detail': 'Only students can register for events.'}, status=status.HTTP_403_FORBIDDEN)
        
    data = request.data.copy()
    data['user'] = request.user.id
    serializer = EventRegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def poster_list(request):
    if request.method == 'GET':
        if request.user.role == 'admin':
            posters = Poster.objects.all()
        elif request.user.role == 'student':
            posters = Poster.objects.filter(author=request.user)
        elif request.user.role == 'reviewer':
            posters = Poster.objects.filter(assignments__reviewer=request.user)
        else:
            posters = Poster.objects.none()
            
        serializer = PosterSerializer(posters, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        if request.user.role != 'student':
            return Response({'detail': 'Only students can submit posters.'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data.copy()
        data['author'] = request.user.id
        serializer = PosterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def poster_detail(request, pk):
    poster = get_object_or_404(Poster, pk=pk)
    
    # Check permissions
    if request.user.role == 'student' and poster.author != request.user:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'GET':
        serializer = PosterSerializer(poster)
        return Response(serializer.data)
        
    if request.method == 'PUT':
        if request.user.role != 'student' or poster.author != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = PosterSerializer(poster, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        if request.user.role != 'admin':
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        poster.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_reviewer(request):
    if request.user.role != 'admin':
        return Response({'detail': 'Only administrators can assign reviewers.'}, status=status.HTTP_403_FORBIDDEN)
        
    serializer = ReviewAssignmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_evaluation(request):
    if request.user.role != 'reviewer':
        return Response({'detail': 'Only reviewers can submit evaluations.'}, status=status.HTTP_403_FORBIDDEN)
        
    poster_id = request.data.get('assignment') # Using assignment field for backwards compatibility in frontend
    assignment = get_object_or_404(ReviewAssignment, poster_id=poster_id, reviewer=request.user)
        
    data = request.data.copy()
    data['assignment'] = assignment.id
    if 'feedback' in data and 'comments' not in data:
        data['comments'] = data['feedback']
        
    serializer = EvaluationSerializer(data=data)
    if serializer.is_valid():
        eval_obj = serializer.save()
        
        # Calculate total score from criteria
        criteria_scores = request.data.get('criteria_scores', {})
        if criteria_scores:
            eval_obj.criteria_scores = criteria_scores
            eval_obj.total_score = sum(float(v) for v in criteria_scores.values())
            eval_obj.save()

        
        # Transition poster status
        poster = assignment.poster
        poster.status = 'EVALUATED'
        poster.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_rankings(request, pk):
    event = get_object_or_404(Event, pk=pk)
    
    if not event.results_published and request.user.role != 'admin':
        return Response({'detail': 'Results for this event are not yet published.'}, status=status.HTTP_403_FORBIDDEN)
        
    posters = Poster.objects.filter(event=event, status='EVALUATED')
    results = []
    
    for poster in posters:
        assignments = ReviewAssignment.objects.filter(poster=poster)
        completed_evals = [a.evaluation for a in assignments if hasattr(a, 'evaluation')]
        
        if len(completed_evals) > 0:
            avg_score = sum(e.total_score for e in completed_evals) / len(completed_evals)
            results.append({
                'poster_id': poster.id,
                'title': poster.title,
                'score': round(avg_score, 2)
            })
            
    # Sort by score descending
    results = sorted(results, key=lambda x: x['score'], reverse=True)
    
    # Assign ranks handling ties
    current_rank = 1
    for i in range(len(results)):
        if i > 0 and results[i]['score'] == results[i-1]['score']:
            results[i]['rank'] = results[i-1]['rank']
        else:
            results[i]['rank'] = current_rank
        current_rank += 1
        
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_analytics(request, pk):
    if request.user.role != 'admin':
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    event = get_object_or_404(Event, pk=pk)
    total_posters = Poster.objects.filter(event=event).count()
    evaluated_posters = Poster.objects.filter(event=event, status='EVALUATED').count()
    total_assignments = ReviewAssignment.objects.filter(poster__event=event).count()
    completed_reviews = Evaluation.objects.filter(assignment__poster__event=event).count()
    
    data = {
        'total_submissions': total_posters,
        'evaluated_submissions': evaluated_posters,
        'total_review_assignments': total_assignments,
        'completed_reviews': completed_reviews,
        'review_completion_percentage': round((completed_reviews / total_assignments * 100) if total_assignments > 0 else 0, 2)
    }
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reviewer_list(request):
    if request.user.role != 'admin':
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    reviewers = User.objects.filter(role='reviewer').values('id', 'username', 'email')
    return Response(list(reviewers))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_assign_reviewers(request):
    if request.user.role != 'admin':
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    
    poster_ids = request.data.get('poster_ids', [])
    reviewer_ids = request.data.get('reviewer_ids', [])
    
    created_count = 0
    for pid in poster_ids:
        for rid in reviewer_ids:
            # Check if assignment already exists to avoid duplicates
            if not ReviewAssignment.objects.filter(poster_id=pid, reviewer_id=rid).exists():
                ReviewAssignment.objects.create(poster_id=pid, reviewer_id=rid)
                created_count += 1
                
    return Response({'detail': f'Successfully created {created_count} assignments.'}, status=status.HTTP_201_CREATED)
