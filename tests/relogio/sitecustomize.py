"""The tests' moved clock: for `python3 -m oedp adiante` only (tests/adiante.py).

Python imports `sitecustomize` at start-up when it finds one on its path, so this file is
loaded only in a process whose PYTHONPATH names this folder. It does nothing unless
OEDP_ENSAIO_DIAS_ADIANTE holds a whole number of days; then datetime.datetime.now, utcnow and
today, datetime.date.today and time.time read that many days ahead of the real clock. A process
started from this one inherits PYTHONPATH and the variable, so its clock is moved too. Only
Python's clock moves: git and the file system keep the real one. No file of oedp/ reads the
variable or imports this file (tests/test_esq3i.py)."""
import os

_dias = os.environ.get("OEDP_ENSAIO_DIAS_ADIANTE", "").strip()
if _dias:
    import datetime as _dt
    import time as _time

    _DESVIO = int(_dias) * 86400  # seconds; a value that is not a whole number stops the process here
    _tempo_real = _time.time
    _DatetimeReal, _DateReal = _dt.datetime, _dt.date

    class _MesmaClasse(type):
        """isinstance and issubclass answer as for the real class, so that a date or a datetime
        made by C code (a datetime's .date(), arithmetic) is still a datetime.date."""

        def __instancecheck__(cls, obj):
            return isinstance(obj, cls.__mro__[1])

        def __subclasscheck__(cls, sub):
            return issubclass(sub, cls.__mro__[1])

    class datetime(_DatetimeReal, metaclass=_MesmaClasse):
        @classmethod
        def now(cls, tz=None):
            return cls.fromtimestamp(_tempo_real() + _DESVIO, tz)

        @classmethod
        def utcnow(cls):
            return cls.fromtimestamp(_tempo_real() + _DESVIO, _dt.timezone.utc).replace(tzinfo=None)

        @classmethod
        def today(cls):
            return cls.fromtimestamp(_tempo_real() + _DESVIO)

    class date(_DateReal, metaclass=_MesmaClasse):
        @classmethod
        def today(cls):
            return cls.fromtimestamp(_tempo_real() + _DESVIO)

    for _classe, _nome in ((datetime, "datetime"), (date, "date")):
        _classe.__module__, _classe.__qualname__ = "datetime", _nome
    _dt.datetime, _dt.date = datetime, date
    _time.time = lambda: _tempo_real() + _DESVIO
