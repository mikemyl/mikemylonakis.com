---
title: "Tools"
layout: archive
permalink: /tools/
author_profile: true
---


{% capture written_label %}'None'{% endcapture %}

{% for collection in site.collections %}
    {% if collection.label == "tools" %}
        {% capture label %}{{ collection.label }}{% endcapture %}
        {% if label != written_label %}
<h2 id="{{ label | slugify }}" class="archive__subtitle">{{ label }}</h2>
            {% capture written_label %}{{ label }}{% endcapture %}
        {% endif %}
        {% for post in collection.docs %}
            {% unless collection.output == false or collection.label == "posts" %}
                {% include archive-single.html %}
            {% endunless %}
        {% endfor %}
    {% endif %}
{% endfor %}