from rest_framework import viewsets
from .models import ONG, Animal, ConsultaVeterinaria, Adotante
from .serializers import ONGSerializer, AnimalSerializer, ConsultaVeterinariaSerializer, AdotanteSerializer


class BaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet customizada que sobrescreve o método de exclusão
    para usar o soft delete do modelo.
    """
    def perform_destroy(self, instance):
        #chama o método .delete() do nosso modelo
        instance.delete()


class ONGViewSet(BaseViewSet):
    # objects agora retorna só os ativos
    queryset = ONG.objects.all()
    serializer_class = ONGSerializer


class AnimalViewSet(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer

    def get_queryset(self):
        queryset = Animal.objects.all()

        # Filtra se o parâmetro "adotado" vier na URL
        adotado_param = self.request.query_params.get('adotado')
        if adotado_param is not None:
            # Converte "true"/"false" (string) para boolean
            adotado_bool = adotado_param.lower() == 'true'
            queryset = queryset.filter(adotado=adotado_bool)

        return queryset

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  
        return super().update(request, *args, **kwargs)


class ConsultaVeterinariaViewSet(BaseViewSet):
    queryset = ConsultaVeterinaria.objects.all()
    serializer_class = ConsultaVeterinariaSerializer
    
class AdotanteViewSet(BaseViewSet):
    queryset = Adotante.objects.all()
    serializer_class = AdotanteSerializer   