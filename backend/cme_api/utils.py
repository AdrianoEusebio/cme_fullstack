from cme_api.models import ProcessHistory, ProductSerial

def registrar_etapa(serial: ProductSerial, etapa: str, user, instancia=None):
    serial.status = etapa
    serial.save()

    kwargs = {
        'serial': serial,
        'etapa': etapa,
        'user': user,
    }

    if instancia:
        model_name = instancia.__class__.__name__.lower()
        kwargs[model_name] = instancia

    ProcessHistory.objects.create(**kwargs)