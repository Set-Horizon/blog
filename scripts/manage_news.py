#!/usr/bin/env python3
"""
Gestione delle notizie per Set Horizon.
Legge un file JSON (news.json) e genera il file src/data/news.js
per l'import nell'app React.

Categorie gestibili separatamente.

Comandi:
  python manage_news.py list                        - elenca le notizie
  python manage_news.py add [titolo]                - aggiunge notizia (se non passato titolo, lo chiede)
  python manage_news.py edit <id>                   - modifica notizia
  python manage_news.py delete <id>                 - elimina notizia
  python manage_news.py sync                        - rigenera news.js da news.json

  python manage_news.py categories list             - elenca le categorie
  python manage_news.py categories add <id> <nome> <colore> - aggiunge categoria
  python manage_news.py categories delete <id>      - elimina categoria
"""

import json
import os
import sys
from datetime import date

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, "..", "src")
JSON_PATH = os.path.join(BASE_DIR, "news.json")
JS_PATH = os.path.join(SRC_DIR, "data", "news.js")

# --- Categorie predefinite ---
DEFAULT_CATEGORIES = [
    {"id": "criminalita", "name": "Criminalità", "color": "#e05a5a"},
    {"id": "tecnologia", "name": "Tecnologia", "color": "#5ab0e0"},
    {"id": "scienza", "name": "Scienza", "color": "#5ae0b0"},
    {"id": "storia", "name": "Storia", "color": "#e0a85a"},
    {"id": "eventi", "name": "Eventi", "color": "#e0d95a"},
    {"id": "politica", "name": "Politica", "color": "#c0392b"},
]

# --- Carica / salva JSON ---
def load_news():
    if not os.path.exists(JSON_PATH):
        print(f"[INFO] {JSON_PATH} non trovato. Creo un file vuoto.")
        save_news([])
        return []
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_news(news):
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(news, f, ensure_ascii=False, indent=2)
    print(f"[OK] Salvato {JSON_PATH}")

# --- Gestione categorie (salvate in un file separato) ---
CATEGORIES_PATH = os.path.join(BASE_DIR, "categories.json")

def load_categories():
    if not os.path.exists(CATEGORIES_PATH):
        save_categories(DEFAULT_CATEGORIES)
        return DEFAULT_CATEGORIES[:]
    with open(CATEGORIES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_categories(cats):
    with open(CATEGORIES_PATH, "w", encoding="utf-8") as f:
        json.dump(cats, f, ensure_ascii=False, indent=2)
    print(f"[OK] Salvato {CATEGORIES_PATH}")

def get_category_name(cat_id, cats):
    for c in cats:
        if c["id"] == cat_id:
            return c["name"]
    return cat_id.capitalize()

# --- Genera news.js ---
def generate_js(news, categories):
    articles_js = "[\n"
    for a in news:
        articles_js += f"""  {{
    id: {a['id']},
    title: {json.dumps(a['title'])},
    excerpt: {json.dumps(a['excerpt'])},
    category: {json.dumps(a['category'])},
    date: {json.dumps(a['date'])},
    image: {json.dumps(a['image'])},
    content: `{a['content']}`,
  }},
"""
    articles_js += "];\n"

    categories_js = "[\n"
    for c in categories:
        categories_js += f"""  {{ id: {json.dumps(c['id'])}, name: {json.dumps(c['name'])}, color: {json.dumps(c['color'])} }},
"""
    categories_js += "];\n"

    js_code = f"""export const newsArticles = {articles_js}

export const categories = {categories_js}
"""
    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_code)
    print(f"[OK] Generato {JS_PATH}")

# --- Prompt per excerpt e content ---
def prompt_details():
    print("\n--- Inserisci excerpt e content ---")
    excerpt = input("Excerpt (breve riassunto): ").strip()
    print("Content (testo completo, premi INVIO dopo una riga vuota per finire):")
    lines = []
    while True:
        line = input()
        if line == "" and len(lines) > 0 and lines[-1] == "":
            break
        lines.append(line)
    content = "\n".join(lines).strip()
    return excerpt, content

def prompt_title():
    title = input("Titolo: ").strip()
    if not title:
        print("Titolo obbligatorio. Operazione annullata.")
        return None
    return title

def prompt_category(categories):
    print("\nCategorie disponibili:")
    for c in categories:
        print(f"  {c['id']:15} → {c['name']}")
    while True:
        cat = input("ID categoria: ").strip()
        if cat in [c["id"] for c in categories]:
            return cat
        print("ID non valido. Scegli tra quelle sopra.")

# --- Comandi notizie ---
def cmd_list(news):
    if not news:
        print("Nessuna notizia presente.")
        return
    print(f"{'ID':<5} {'Titolo':<50} {'Categoria':<15} {'Data':<12}")
    print("-" * 85)
    for a in news:
        print(f"{a['id']:<5} {a['title'][:50]:<50} {a['category']:<15} {a['date']:<12}")

def cmd_add(news):
    # Se non passato, chiede titolo interattivamente
    if len(sys.argv) >= 3:
        title = sys.argv[2]
    else:
        title = prompt_title()
        if title is None:
            return
    categories = load_categories()
    cat_id = prompt_category(categories)
    excerpt, content = prompt_details()
    new_id = max([a["id"] for a in news] + [0]) + 1
    today = date.today().isoformat()
    cat_name = get_category_name(cat_id, categories)
    new_article = {
        "id": new_id,
        "title": title,
        "excerpt": excerpt,
        "category": cat_name,
        "date": today,
        "image": f"https://placehold.co/800x400/1a1a2e/e0a82c?text={title.replace(' ', '+')}",
        "content": content,
    }
    news.append(new_article)
    save_news(news)
    generate_js(news, categories)
    print(f"[OK] Aggiunta notizia #{new_id}")

def cmd_edit(news):
    if len(sys.argv) < 3:
        print("Uso: manage_news.py edit <id>")
        return
    try:
        id_ = int(sys.argv[2])
    except ValueError:
        print("ID non valido.")
        return
    article = next((a for a in news if a["id"] == id_), None)
    if not article:
        print(f"Notizia #{id_} non trovata.")
        return
    categories = load_categories()
    print(f"Modifica notizia #{id_}: {article['title']}")
    print("Lascia vuoto per mantenere il valore corrente.")
    new_title = input(f"Titolo [{article['title']}]: ").strip()
    if new_title:
        article["title"] = new_title
    new_excerpt = input(f"Excerpt [{article['excerpt']}]: ").strip()
    if new_excerpt:
        article["excerpt"] = new_excerpt
    new_cat_id = input(f"Categoria [{article['category']}] (digita ID o lascia vuoto): ").strip()
    if new_cat_id:
        cat_found = next((c for c in categories if c["id"] == new_cat_id), None)
        if cat_found:
            article["category"] = cat_found["name"]
        else:
            print(f"Categoria '{new_cat_id}' non trovata, mantenuta '{article['category']}'")
    new_date = input(f"Data [{article['date']}]: ").strip()
    if new_date:
        article["date"] = new_date
    new_image = input(f"URL immagine [{article['image']}]: ").strip()
    if new_image:
        article["image"] = new_image
    print("Content (premi INVIO dopo riga vuota per terminare):")
    print("--- Content corrente ---")
    print(article["content"])
    print("---")
    new_content = []
    print("Nuovo content (invia riga vuota per saltare):")
    while True:
        line = input()
        if line == "":
            break
        new_content.append(line)
    if new_content:
        article["content"] = "\n".join(new_content)
    save_news(news)
    generate_js(news, categories)
    print(f"[OK] Modificata notizia #{id_}")

def cmd_delete(news):
    if len(sys.argv) < 3:
        print("Uso: manage_news.py delete <id>")
        return
    try:
        id_ = int(sys.argv[2])
    except ValueError:
        print("ID non valido.")
        return
    article = next((a for a in news if a["id"] == id_), None)
    if not article:
        print(f"Notizia #{id_} non trovata.")
        return
    news.remove(article)
    categories = load_categories()
    save_news(news)
    generate_js(news, categories)
    print(f"[OK] Eliminata notizia #{id_}")

def cmd_sync(news):
    categories = load_categories()
    generate_js(news, categories)

# --- Comandi categorie ---
def cmd_categories_list():
    cats = load_categories()
    if not cats:
        print("Nessuna categoria.")
        return
    print(f"{'ID':<20} {'Nome':<20} {'Colore':<10}")
    print("-" * 50)
    for c in cats:
        print(f"{c['id']:<20} {c['name']:<20} {c['color']:<10}")

def cmd_categories_add():
    if len(sys.argv) < 6:
        print("Uso: manage_news.py categories add <id> <nome> <colore>")
        return
    cat_id = sys.argv[3]
    cat_name = sys.argv[4]
    cat_color = sys.argv[5]
    cats = load_categories()
    if cat_id in [c["id"] for c in cats]:
        print(f"Errore: categoria '{cat_id}' già esistente.")
        return
    cats.append({"id": cat_id, "name": cat_name, "color": cat_color})
    save_categories(cats)
    print(f"[OK] Aggiunta categoria '{cat_id}'")

def cmd_categories_delete():
    if len(sys.argv) < 4:
        print("Uso: manage_news.py categories delete <id>")
        return
    cat_id = sys.argv[3]
    cats = load_categories()
    cats = [c for c in cats if c["id"] != cat_id]
    save_categories(cats)
    # Nota: le notizie con questa categoria rimarranno, ma il nome non sarà più gestito
    print(f"[OK] Eliminata categoria '{cat_id}' (le notizie con questa categoria restano)")

def main():
    if len(sys.argv) < 2:
        print("Comandi: list, add, edit, delete, sync")
        print("  categories list / categories add <id> <nome> <colore> / categories delete <id>")
        return

    command = sys.argv[1]

    # Comandi per categorie
    if command == "categories":
        if len(sys.argv) < 3:
            print("Sottocomando mancante: list, add, delete")
            return
        sub = sys.argv[2]
        if sub == "list":
            cmd_categories_list()
        elif sub == "add":
            cmd_categories_add()
        elif sub == "delete":
            cmd_categories_delete()
        else:
            print(f"Sottocomando sconosciuto: {sub}")
        return

    # Comandi per notizie
    news = load_news()

    if command == "list":
        cmd_list(news)
    elif command == "add":
        cmd_add(news)
    elif command == "edit":
        cmd_edit(news)
    elif command == "delete":
        cmd_delete(news)
    elif command == "sync":
        cmd_sync(news)
    else:
        print(f"Comando sconosciuto: {command}")

if __name__ == "__main__":
    main()
