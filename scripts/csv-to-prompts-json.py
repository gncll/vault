#!/usr/bin/env python3
"""
CSV to Prompts JSON Converter
Converts prompts.csv to our custom prompts.json format using Claude API
"""

import csv
import json
import re
import os
import time
from anthropic import Anthropic

# Load API key from env file
def load_env():
    env_path = "/Users/learnai/Desktop/vault/members-portal/.env.local"
    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('ANTHROPIC_API_KEY'):
                # Extract value, handling quotes
                value = line.split('=', 1)[1].strip().strip('"')
                return value
    raise Exception("ANTHROPIC_API_KEY not found in .env.local")

# Initialize Anthropic client
API_KEY = load_env()
client = Anthropic(api_key=API_KEY)

# File paths
CSV_PATH = "/Users/learnai/Downloads/prompts.csv"
OUTPUT_PATH = "/Users/learnai/Desktop/vault-content/prompts-new.json"

def extract_variables(prompt_text):
    """
    Extract customizable variables from prompt text.
    Patterns: {variable}, ${variable}, ${variable:default}
    """
    variables = []

    # Pattern 1: ${Variable:Default Value} or ${Variable}
    pattern1 = r'\$\{([^}:]+)(?::([^}]*))?\}'
    matches1 = re.findall(pattern1, prompt_text)
    for match in matches1:
        var_name = match[0].strip()
        default_value = match[1].strip() if match[1] else ""
        if var_name and var_name not in [v['name'] for v in variables]:
            variables.append({
                'name': var_name,
                'default': default_value
            })

    # Pattern 2: {variable} (but not inside code blocks)
    pattern2 = r'\{([a-zA-Z_][a-zA-Z0-9_]*)\}'
    matches2 = re.findall(pattern2, prompt_text)
    for var_name in matches2:
        # Skip common false positives
        if var_name.lower() in ['like', 'this', 'example', 'text', 'code', 'json', 'html', 'css', 'js']:
            continue
        if var_name not in [v['name'] for v in variables]:
            variables.append({
                'name': var_name,
                'default': ""
            })

    return variables

def generate_metadata_with_claude(title, prompt_text, variables):
    """
    Use Claude Haiku to generate category, description, tags, and customizableFields
    """

    variables_str = ", ".join([v['name'] for v in variables]) if variables else "None"

    system_prompt = """You are a prompt metadata generator. Given a prompt title and content, generate:
1. category: One of these categories: "Writing", "Coding", "Research", "Analysis", "Conversation", "Creative", "Business", "Education", "Productivity", "Critical Thinking", "Language", "Technical"
2. description: A concise 10-15 word description of what this prompt does
3. tags: 2-4 relevant tags as an array
4. customizableFields: For each variable, generate appropriate field metadata

Respond ONLY with valid JSON, no markdown, no explanation."""

    user_prompt = f"""Title: {title}

Prompt content:
{prompt_text[:1500]}

Variables found: {variables_str}

Generate JSON with this exact structure:
{{
  "category": "Category Name",
  "description": "Short description here",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "customizableFields": [
    {{
      "name": "variable_name",
      "label": "Human readable label",
      "type": "text|textarea|select",
      "required": true|false,
      "placeholder": "Example placeholder"
    }}
  ]
}}

If no variables, customizableFields should be an empty array []."""

    try:
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=500,
            messages=[
                {"role": "user", "content": user_prompt}
            ],
            system=system_prompt
        )

        result_text = response.content[0].text.strip()

        # Clean up response if it has markdown
        if result_text.startswith("```"):
            result_text = re.sub(r'^```json?\n?', '', result_text)
            result_text = re.sub(r'\n?```$', '', result_text)

        return json.loads(result_text)

    except Exception as e:
        print(f"  Error with Claude API: {e}")
        # Return fallback
        return {
            "category": "Productivity",
            "description": f"A prompt for {title}",
            "tags": ["AI", "Assistant"],
            "customizableFields": []
        }

def convert_csv_to_json(start_id=1, limit=None):
    """
    Main conversion function
    """
    prompts = []

    # Read CSV
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    total = len(rows) if limit is None else min(limit, len(rows))
    print(f"Processing {total} prompts...")

    for i, row in enumerate(rows[:total]):
        current_id = start_id + i
        title = row['act'].strip()
        prompt_text = row['prompt'].strip()

        print(f"[{i+1}/{total}] Processing: {title[:50]}...")

        # Extract variables from prompt
        variables = extract_variables(prompt_text)

        # Get metadata from Claude
        metadata = generate_metadata_with_claude(title, prompt_text, variables)

        # Build the prompt object
        prompt_obj = {
            "id": current_id,
            "title": title,
            "category": metadata.get("category", "Productivity"),
            "description": metadata.get("description", f"A prompt for {title}"),
            "prompt": prompt_text,
            "tags": metadata.get("tags", ["AI"]),
            "customizableFields": metadata.get("customizableFields", [])
        }

        prompts.append(prompt_obj)

        # Rate limiting - be nice to the API
        if i < total - 1:
            time.sleep(0.5)

    return prompts

def main():
    print("=" * 50)
    print("CSV to Prompts JSON Converter")
    print("=" * 50)

    # First, test with 3 prompts
    print("\nTest mode: Processing first 3 prompts...")
    test_prompts = convert_csv_to_json(start_id=1000, limit=3)

    print("\n" + "=" * 50)
    print("TEST RESULTS:")
    print("=" * 50)
    print(json.dumps(test_prompts, indent=2, ensure_ascii=False))

    # Ask to continue
    print("\n" + "=" * 50)
    response = input("Continue with all 471 prompts? (yes/no): ")

    if response.lower() in ['yes', 'y', 'evet', 'e']:
        print("\nProcessing all prompts...")
        all_prompts = convert_csv_to_json(start_id=1000, limit=None)

        # Save to file
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(all_prompts, indent=2, ensure_ascii=False, fp=f)

        print(f"\nDone! Saved {len(all_prompts)} prompts to {OUTPUT_PATH}")
    else:
        print("Cancelled.")

if __name__ == "__main__":
    main()
