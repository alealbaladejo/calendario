from flask import Flask, render_template, request
from datetime import datetime, timedelta
import calendar

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def calendario():
    # Obtener mes y año desde la URL o usar el actual
    month = request.args.get('month', type=int) or datetime.now().month
    year = request.args.get('year', type=int) or datetime.now().year
    current_year = datetime.now().year

    # Crear la estructura del calendario
    cal = calendar.Calendar(firstweekday=0)  # lunes
    month_days = cal.monthdatescalendar(year, month)

    weeks = []
    total_month_hours = 0

    for week in month_days:
        week_data = []
        weekly_total = 0

        for day in week:
            day_info = {'date': None}
            if day.month == month:
                date_str = day.strftime('%Y-%m-%d')
                status = request.form.get(f'status_{date_str}', 'libre')
                entrada1 = request.form.get(f'entrada1_{date_str}', '')
                salida1 = request.form.get(f'salida1_{date_str}', '')
                entrada2 = request.form.get(f'entrada2_{date_str}', '')
                salida2 = request.form.get(f'salida2_{date_str}', '')

                total_dia = calcular_total_horas(entrada1, salida1) + calcular_total_horas(entrada2, salida2)
                weekly_total += total_dia
                total_month_hours += total_dia

                day_info = {
                    'date': day,
                    'status': status,
                    'entrada1': entrada1,
                    'salida1': salida1,
                    'entrada2': entrada2,
                    'salida2': salida2,
                    'total_dia': f'{total_dia:.2f}'
                }

            week_data.append(day_info)

        for d in week_data:
            if d.get('date') and d['date'].month == month:
                d['weekly_total'] = f'{weekly_total:.2f}'
                break

        weeks.append(week_data)

    return render_template('calendar.html', month=month, year=year, current_year=current_year,
                           weeks=weeks, total_month_hours=f'{total_month_hours:.2f}')
                           

def calcular_total_horas(entrada, salida):
    if entrada and salida:
        try:
            fmt = "%H:%M"
            t_entrada = datetime.strptime(entrada, fmt)
            t_salida = datetime.strptime(salida, fmt)
            if t_salida > t_entrada:
                return (t_salida - t_entrada).seconds / 3600
        except ValueError:
            pass
    return 0
