from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('example_api', views.EdtwViewSet, basename='example_api')

urlpatterns = [
    path('', include(router.urls)),
    path('get-audio', views.GetAudioViewSet.as_view({'post': 'create'})),
    path('fade-in', views.FadeInOut.as_view({'post': 'create'}))
]
