# Create .nojekyll file (empty file to prevent Jekyll processing)
with open('.nojekyll', 'w') as f:
    f.write('')

print(".nojekyll file created successfully!")

# Create case study data
case_studies_data = {
    "cases": [
        {
            "id": "toyota",
            "company": "トヨタ自動車",
            "title": "EV戦略転換のジレンマ",
            "difficulty": "advanced",
            "duration": "120分",
            "frameworks": ["SWOT", "バリューチェーン", "シナリオプランニング"],
            "description": "百年の歴史を持つ自動車メーカーが直面する電動化への戦略的転換と実行課題を分析します。",
            "scenario": "2025年5月、トヨタ本社にて豊田章男会長より緊急の戦略見直し指示。HV技術への巨額投資をどう活用するか、EV専業メーカーとの競争戦略、従業員20万人のスキル転換など複合的課題への対応が求められています。",
            "financial_data": {
                "revenue": "43.2兆円",
                "r_and_d": "1兆4000億円",
                "ev_investment": "8兆円（2030年まで）",
                "hv_market_share": "50%（グローバル）"
            },
            "key_challenges": [
                "内燃機関技術への巨額投資の活用方法",
                "EV専業メーカーとの競争戦略",
                "従業員20万人のスキル転換",
                "中国市場でのシェア回復（10%→8%）"
            ],
            "deliverables": [
                "10年間のEV戦略ロードマップ",
                "投資配分最適化計画",
                "組織変革プログラム",
                "中国市場再参入戦略"
            ]
        },
        {
            "id": "tesla",
            "company": "Tesla日本法人",
            "title": "プレミアム戦略の限界",
            "difficulty": "intermediate",
            "duration": "90分",
            "frameworks": ["Porter's 5 Forces", "市場細分化"],
            "description": "日本市場特有の課題に直面するTeslaの市場戦略見直しを検討します。",
            "scenario": "Tesla Japan責任者より、価格戦略の見直しとマーケットアプローチの再検討を依頼。Model 3価格556万円→499万円への戦略転換、充電インフラ45→50箇所拡張、ブランド認知度予測2028年目標5%達成への課題分析が必要です。",
            "financial_data": {
                "model_3_price": "499万円（改定後）",
                "charging_stations": "50箇所（計画）",
                "market_share": "1.2%（日本EV市場）",
                "brand_awareness": "2%（目標5%）"
            },
            "key_challenges": [
                "価格感応度への対応",
                "充電インフラ最適化",
                "日本特有の購買行動への適応",
                "ディーラー網拡張"
            ]
        },
        {
            "id": "isuzu",
            "company": "いすゞ自動車",
            "title": "商用モビリティソリューションカンパニーへの変革戦略",
            "difficulty": "advanced",
            "duration": "110分",
            "frameworks": ["SWOT", "シナリオプランニング", "競合分析"],
            "description": "商用車特化戦略とエルフEV展開による新中期経営計画「ISUZU Transformation」の見直しを分析します。",
            "scenario": "南真介社長による新中期経営計画の見直し指示。エルフEV特装車の市場拡大戦略、400億円投資の電動開発実験棟のROI最大化、アジア市場での販売減少対策（前年比▲28%）が主要課題です。",
            "financial_data": {
                "revenue": "3兆2,081億円（2025年3月期）",
                "operating_profit": "2,291億円",
                "ev_investment": "400億円（開発実験棟）",
                "asia_sales_decline": "▲28%（前年比）"
            },
            "key_challenges": [
                "商用車特化戦略の競争力強化",
                "エルフEV特装車市場拡大",
                "BYD等商用EV勢力への対応",
                "アジア市場回復戦略"
            ]
        },
        {
            "id": "honda",
            "company": "ホンダ",
            "title": "知能化×電動化戦略の軌道修正と競争力強化",
            "difficulty": "advanced", 
            "duration": "105分",
            "frameworks": ["SWOT", "シナリオプランニング", "技術戦略分析"],
            "description": "2025年ビジネスアップデートで発表された戦略転換における投資削減とEV目標下方修正の影響を分析します。",
            "scenario": "三部敏宏社長による2025年戦略転換発表後の分析要請。電動化投資10兆円→7兆円削減、EV目標30%→20%下方修正、次世代ADAS（2027年導入）差別化戦略、Honda 0シリーズ（2026年投入）成功確率向上が検討課題です。",
            "financial_data": {
                "revenue": "21兆6,887億円",
                "ev_investment_reduction": "▲3兆円（10→7兆円）",
                "ev_target_revision": "20%（従来30%）",
                "hev_target": "220万台販売"
            },
            "key_challenges": [
                "戦略軌道修正の合理性評価",
                "中国Momenta連携戦略最適化",
                "HEV技術優位性の活用",
                "Honda 0シリーズ成功戦略"
            ]
        }
    ]
}

import json
with open('case_studies.json', 'w', encoding='utf-8') as f:
    json.dump(case_studies_data, f, ensure_ascii=False, indent=2)

print("case_studies.json created successfully!")