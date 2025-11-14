# core/urls.py
from rest_framework.routers import DefaultRouter
from .views import ONGViewSet, AnimalViewSet, ConsultaVeterinariaViewSet, AdotanteViewSet

router = DefaultRouter()

# 🔹 Registrando as rotas com basename explícito (evita erros do DRF)
router.register(r'ongs', ONGViewSet, basename='ong')
router.register(r'animais', AnimalViewSet, basename='animal')
router.register(r'consultas', ConsultaVeterinariaViewSet, basename='consulta')
router.register(r'adotantes', AdotanteViewSet, basename='adotante')

urlpatterns = router.urls
