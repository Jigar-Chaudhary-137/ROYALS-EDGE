"""
Dataset Validation and Ingestion Engine for Royal Scout
Handles ZIP unpacking, individual file uploads, recursive scanning,
schema inspection, foreign key integrity checks, duplicate detection,
and data quality reporting.
"""

import os
import zipfile
import shutil
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple

EXPECTED_FILES = {
    'ball_by_ball': 'ball_by_ball.csv',
    'matches': 'matches.csv',
    'competitions': 'competitions.csv',
    'teams': 'teams.csv',
    'playing_eleven': 'playing_eleven.csv',
    'mapping': 'competition_team_player_mapping.csv'
}

EXPECTED_COLUMNS = {
    'ball_by_ball': [
        'match_id', 'innings', 'overid', 'over_ball_num', 'striker_id', 'bowler_id',
        'runs', 'is_wicket', 'extras_type', 'extras1_runs', 'extras_2_runs'
    ],
    'matches': ['match_id', 'comp_id', 'match_date', 'stage', 'win_team_id', 'result'],
    'competitions': ['comp_id', 'comp_name', 'match_format', 'season'],
    'teams': ['comp_id', 'team_id', 'team_name'],
    'playing_eleven': ['match_id', 'team_id', 'player_id'],
    'mapping': ['comp_id', 'comp_name', 'team_id', 'team_name', 'player_id', 'player_name']
}

def extract_zip_archive(zip_path: str, dest_dir: str) -> Dict[str, Any]:
    """
    Safely extracts uploaded ZIP archive, ignoring macOS metadata and hidden files,
    recursively searches for CSV and PDF files, and maps them to target_dir.
    """
    os.makedirs(dest_dir, exist_ok=True)
    imported = []
    skipped = []

    with zipfile.ZipFile(zip_path, 'r') as z:
        for member in z.infolist():
            # Skip macOS metadata and dotfiles
            if '__MACOSX' in member.filename or '.DS_Store' in member.filename or member.filename.startswith('.'):
                skipped.append(member.filename)
                continue
            
            base_name = os.path.basename(member.filename)
            if not base_name:
                continue
            
            # Target path directly in dest_dir
            target_path = os.path.join(dest_dir, base_name)
            with z.open(member) as source, open(target_path, 'wb') as target:
                shutil.copyfileobj(source, target)
            
            imported.append({
                'filename': base_name,
                'size_bytes': os.path.getsize(target_path),
                'size_kb': round(os.path.getsize(target_path) / 1024, 1)
            })

    return {
        'success': True,
        'imported_files': imported,
        'skipped_files': len(skipped),
        'destination': dest_dir
    }

def run_data_validation(data_dir: str) -> Dict[str, Any]:
    """
    Performs rigorous data quality checks across all datasets:
    - Verifies presence of required files
    - Checks row and column counts
    - Validates schema against expected keys
    - Checks missing values per column
    - Checks duplicate records
    - Verifies cross-table foreign key relationships
    """
    report = {
        'files_status': {},
        'missing_files': [],
        'schemas': {},
        'data_quality': {},
        'integrity_checks': {},
        'is_ready_for_analysis': True,
        'total_records': 0
    }

    loaded_dfs = {}

    for key, filename in EXPECTED_FILES.items():
        file_path = os.path.join(data_dir, filename)
        if not os.path.exists(file_path):
            report['missing_files'].append(filename)
            report['files_status'][filename] = {'status': 'Missing', 'rows': 0, 'cols': 0}
            report['is_ready_for_analysis'] = False
            continue

        try:
            # Read first chunk or entire file
            df = pd.read_csv(file_path)
            loaded_dfs[key] = df
            rows, cols = df.shape
            report['total_records'] += rows
            
            # Check expected columns
            missing_cols = [c for c in EXPECTED_COLUMNS.get(key, []) if c not in df.columns]
            
            # Check nulls and duplicates
            null_counts = df.isna().sum().to_dict()
            null_pcts = {k: round((v / max(1, rows)) * 100.0, 1) for k, v in null_counts.items() if v > 0}
            dup_count = int(df.duplicated().sum())

            report['files_status'][filename] = {
                'status': 'Loaded',
                'rows': rows,
                'cols': cols,
                'duplicates': dup_count,
                'missing_expected_columns': missing_cols,
                'size_mb': round(os.path.getsize(file_path) / (1024 * 1024), 2)
            }

            report['schemas'][key] = {
                'filename': filename,
                'columns': list(df.columns),
                'dtypes': {col: str(dtype) for col, dtype in df.dtypes.items()}
            }

            report['data_quality'][key] = {
                'rows': rows,
                'cols': cols,
                'duplicates': dup_count,
                'columns_with_nulls': null_pcts
            }

        except Exception as e:
            report['files_status'][filename] = {'status': 'Error', 'error': str(e)}
            report['is_ready_for_analysis'] = False

    # Problem statement PDF check
    pdf_path = os.path.join(data_dir, 'Round 1 Problem Statement _ SupeRR Selector Season 2.docx.pdf')
    report['problem_statement_pdf'] = {
        'found': os.path.exists(pdf_path),
        'size_kb': round(os.path.getsize(pdf_path) / 1024, 1) if os.path.exists(pdf_path) else 0
    }

    # Cross-table relationship integrity checks
    if 'ball_by_ball' in loaded_dfs and 'matches' in loaded_dfs:
        bbb_match_ids = set(loaded_dfs['ball_by_ball']['match_id'].unique())
        m_match_ids = set(loaded_dfs['matches']['match_id'].unique())
        orphan_matches = len(bbb_match_ids - m_match_ids)
        report['integrity_checks']['bbb_matches_orphan_count'] = orphan_matches
        report['integrity_checks']['matches_coverage_pct'] = round(len(bbb_match_ids & m_match_ids) / len(bbb_match_ids) * 100.0, 1)

    if 'matches' in loaded_dfs and 'competitions' in loaded_dfs:
        m_comp_ids = set(loaded_dfs['matches']['comp_id'].unique())
        c_comp_ids = set(loaded_dfs['competitions']['comp_id'].unique())
        report['integrity_checks']['competitions_coverage_pct'] = round(len(m_comp_ids & c_comp_ids) / len(m_comp_ids) * 100.0, 1)

    return report

