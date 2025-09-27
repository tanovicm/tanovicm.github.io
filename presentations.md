---
layout: default
title: Prezentacije
---

<div class="presentations-page">
  <header class="page-header">
    <h1>Prezentacije</h1>
    <p>Kolekcija mojih prezentacija i predavanja.</p>
  </header>

  <div class="presentations-grid">
    {% assign presentations = site.pages | where: "layout", "presentation" | sort: "date" | reverse %}
    {% for presentation in presentations %}
      <div class="presentation-card">
        <div class="presentation-thumbnail">
          {% if presentation.thumbnail %}
            <img src="{{ presentation.thumbnail }}" alt="{{ presentation.title }}" />
          {% else %}
            <div class="default-thumbnail">
              📊
            </div>
          {% endif %}
        </div>
        
        <div class="presentation-info">
          <h3 class="presentation-title">
            <a href="{{ presentation.url | relative_url }}">{{ presentation.title }}</a>
          </h3>
          
          {% if presentation.date %}
            <p class="presentation-date">
              {{ presentation.date | date: "%B %Y" }}
            </p>
          {% endif %}
          
          {% if presentation.description %}
            <p class="presentation-description">{{ presentation.description }}</p>
          {% endif %}
          
          <div class="presentation-links">
            <a href="{{ presentation.url | relative_url }}" class="view-link">Pogledaj</a>
            {% if presentation.pdf_file %}
              <a href="{{ presentation.pdf_file }}" target="_blank" class="pdf-link">PDF</a>
            {% endif %}
            {% if presentation.pptx_file %}
              <a href="{{ presentation.pptx_file }}" download class="pptx-link">PPTX</a>
            {% endif %}
          </div>
        </div>
      </div>
    {% endfor %}
  </div>

  {% if presentations.size == 0 %}
    <div class="no-presentations">
      <p>Trenutno nema dostupnih prezentacija.</p>
    </div>
  {% endif %}
</div>