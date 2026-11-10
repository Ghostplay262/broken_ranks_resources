
import pulp

# ==========================================
# 1. DANE WEJSCIOWE
# ==========================================

items = {
    "Helmet": {"capacity": 10},
    "Armor":  {"capacity": 15},
    "Weapon": {"capacity": 12},
    "Boots":  {"capacity": 8},
}

drifs = {
    "Drif_A": {
        "level": 5,
        "quantity": 2,
        "capacity": 4,
        "power": 5,
        "mods": {"strength": 3}
    },
    "Drif_B": {
        "level": 8,
        "quantity": 1,
        "capacity": 6,
        "power": 8,
        "mods": {"strength": 5, "defense": 2}
    },
    "Drif_C": {
        "level": 3,
        "quantity": 3,
        "capacity": 2,
        "power": 2,
        "mods": {"defense": 2}
    },
    "Drif_D": {
        "level": 10,
        "quantity": 1,
        "capacity": 7,
        "power": 10,
        "mods": {"critical": 4}
    },
}

# Przelicznik bonusu modyfikatora na Power.
# Wartości przykładowe - do zastąpienia
# rzeczywistym wzorem Power.

power_per_mod = {
    "strength": 1.0,
    "defense": 0.8,
    "critical": 1.2,
}

# ==========================================
# 2. TABELA EFEKTYWNOSCI
# ==========================================

efficiency = {
    0: 1.00,
    1: 1.00,
    2: 1.00,
    3: 1.00,
    4: 0.95,
    5: 0.87,
    6: 0.80,
    7: 0.74,
    8: 0.69,
    9: 0.64,
    10: 0.59,
    11: 0.54,
    12: 0.50,
}

MAX_REPEATS = 12

# ==========================================
# 3. TWORZENIE MODELU
# ==========================================

model = pulp.LpProblem(
    "Broken_Ranks_Power_Optimizer",
    pulp.LpMaximize
)

# Wszystkie modyfikatory wystepujace w drifach

modifiers = sorted(set(
    m
    for d in drifs.values()
    for m in d["mods"]
))

# ==========================================
# 4. ZMIENNE DECYZYJNE
# ==========================================

# x[d,i] - liczba drifow typu d w przedmiocie i

x = {
    (d, i): pulp.LpVariable(
        f"x_{d}_{i}",
        lowBound=0,
        upBound=drifs[d]["quantity"],
        cat=pulp.LpInteger
    )
    for d in drifs
    for i in items
}

# y[m,k] - czy modyfikator m wystepuje k razy

y = {
    (m, k): pulp.LpVariable(
        f"y_{m}_{k}",
        cat=pulp.LpBinary
    )
    for m in modifiers
    for k in range(MAX_REPEATS + 1)
}

# w[m,k,d,i] - iloczyn x[d,i] * y[m,k]
# Zmienne pomocnicze do linearyzacji

w = {}

for m in modifiers:
    for k in range(MAX_REPEATS + 1):
        for d in drifs:
            if m not in drifs[d]["mods"]:
                continue

            for i in items:
                w[m, k, d, i] = pulp.LpVariable(
                    f"w_{m}_{k}_{d}_{i}",
                    lowBound=0,
                    cat=pulp.LpInteger
                )

# ==========================================
# 5. OGRANICZENIA PODSTAWOWE
# ==========================================

# A. Dostepna liczba drifow

for d in drifs:
    model += (
        pulp.lpSum(x[d, i] for i in items)
        <= drifs[d]["quantity"]
    )

# B. Pojemnosc przedmiotow

for i in items:
    model += (
        pulp.lpSum(
            drifs[d]["capacity"] * x[d, i]
            for d in drifs
        )
        <= items[i]["capacity"]
    )

# ==========================================
# 6. LICZBA POWTORZEN MODYFIKATOROW
# ==========================================

for m in modifiers:

    # Liczba wszystkich drifow dajacych modyfikator m

    count = pulp.lpSum(
        x[d, i]
        for d in drifs
        if m in drifs[d]["mods"]
        for i in items
    )

    # Maksymalna liczba dostepnych drifow z modyfikatorem m

    upper = sum(
        drifs[d]["quantity"]
        for d in drifs
        if m in drifs[d]["mods"]
    )

    # Wybor dokladnie jednego poziomu efektywnosci

    model += (
        pulp.lpSum(
            y[m, k]
            for k in range(MAX_REPEATS + 1)
        ) == 1
    )

    # Liczba wystapien musi odpowiadac wybranemu poziomowi

    model += (
        count == pulp.lpSum(
            k * y[m, k]
            for k in range(MAX_REPEATS + 1)
        )
    )

    # Ograniczenie zakresu tabeli

    model += count <= MAX_REPEATS

    # ======================================
    # 7. LINEARYZACJA ILOCZYNU ZMIENNYCH
    # ======================================

    for k in range(MAX_REPEATS + 1):

        for d in drifs:

            if m not in drifs[d]["mods"]:
                continue

            for i in items:

                # w = x * y

                model += (
                    w[m, k, d, i]
                    <= x[d, i]
                )

                model += (
                    w[m, k, d, i]
                    <= drifs[d]["quantity"] * y[m, k]
                )

                model += (
                    w[m, k, d, i]
                    >= x[d, i]
                    - drifs[d]["quantity"] * (1 - y[m, k])
                )

# ==========================================
# 8. EFEKTYWNE BONUSY MODYFIKATOROW
# ==========================================

effective_mods = {}

for m in modifiers:

    effective_mods[m] = pulp.lpSum(
        efficiency[k]
        * drifs[d]["mods"][m]
        * w[m, k, d, i]

        for k in range(MAX_REPEATS + 1)
        for d in drifs
        if m in drifs[d]["mods"]
        for i in items
    )

# ==========================================
# 9. FUNKCJA CELU - MAKSYMALIZACJA POWER
# ==========================================

base_power = pulp.lpSum(
    drifs[d]["power"] * x[d, i]
    for d in drifs
    for i in items
)

modifier_power = pulp.lpSum(
    power_per_mod[m] * effective_mods[m]
    for m in modifiers
)

model += base_power + modifier_power

# ==========================================
# 10. ROZWIAZANIE
# ==========================================

solver = pulp.PULP_CBC_CMD(msg=False)

model.solve(solver)

# ==========================================
# 11. PREZENTACJA WYNIKOW
# ==========================================

status = pulp.LpStatus[model.status]

print("STATUS:", status)

if status == "Optimal":

    print("\nOPTYMALNE ROZMIESZCZENIE DRIFOW")

    for i in items:

        used_capacity = 0

        print(f"\n{i}:")

        for d in drifs:

            amount = int(round(pulp.value(x[d, i])))

            if amount > 0:

                print(
                    f"  {d} (lvl {drifs[d]['level']}): "
                    f"{amount} szt."
                )

                used_capacity += (
                    amount * drifs[d]["capacity"]
                )

        print(
            f"  Pojemnosc: {used_capacity}"
            f"/{items[i]['capacity']}"
        )

    print("\nEFEKTYWNOSC MODYFIKATOROW")

    for m in modifiers:

        count = sum(
            int(round(pulp.value(x[d, i])))
            for d in drifs
            if m in drifs[d]["mods"]
            for i in items
        )

        print(
            f"{m}: {count} wystapien, "
            f"{efficiency[count] * 100:.0f}% efektywnosci"
        )

        print(
            f"  Efektywny bonus: "
            f"{pulp.value(effective_mods[m]):.2f}"
        )

    print("\nPOWER")

    print("Bazowy Power:", pulp.value(base_power))

    print("Power z modyfikatorow:", pulp.value(modifier_power))

    print("Power koncowy:", pulp.value(model.objective))

else:

    print("Nie znaleziono rozwiazania optymalnego.")
