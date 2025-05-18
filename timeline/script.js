document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('timeline');
    const scrollLeftButton = document.getElementById('scroll-left');
    const scrollRightButton = document.getElementById('scroll-right');
    const timelineWrapper = document.querySelector('.timeline-wrapper');

    const addEventButton = document.getElementById('add-event-button');
    const eventYearInput = document.getElementById('event-year');
    const eventDecadeSelect = document.getElementById('event-decade');
    const eventTitleInput = document.getElementById('event-title');
    const eventDescriptionInput = document.getElementById('event-description');
    const eventImageUrlInput = document.getElementById('event-image-url');

    const startYear = 1800;
    const endYear = 2000;
    const decadeWidth = 150; // Must match .decade-marker min-width in CSS
    let currentScrollPosition = 0;
    const scrollAmount = decadeWidth * 2; // Scroll by two decades at a time

    // --- Populate Decade Select for Form ---
    for (let year = startYear; year < endYear; year += 10) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year}s`;
        eventDecadeSelect.appendChild(option);
    }

    // Auto-select decade when year is entered
    eventYearInput.addEventListener('input', () => {
        const year = parseInt(eventYearInput.value);
        if (year >= startYear && year <= endYear) {
            const decadeStart = Math.floor(year / 10) * 10;
            eventDecadeSelect.value = decadeStart;
        }
    });


    // --- Generate Timeline Markers ---
    function createTimelineMarkers() {
        let totalWidth = 0;
        for (let year = startYear; year < endYear; year += 10) {
            const marker = document.createElement('div');
            marker.classList.add('decade-marker');
            marker.dataset.decade = year; // Store the decade start year

            const yearText = document.createElement('div');
            yearText.classList.add('decade-year');
            yearText.textContent = `${year}s`;
            marker.appendChild(yearText);

            timeline.appendChild(marker);
            totalWidth += decadeWidth;
        }
        timeline.style.width = `${totalWidth}px`;
    }

    // --- Scrolling Functionality ---
    function scrollTimeline(direction) {
        const maxScroll = timeline.offsetWidth - timelineWrapper.offsetWidth;
        if (direction === 'left') {
            currentScrollPosition += scrollAmount;
            if (currentScrollPosition > 0) currentScrollPosition = 0; // Boundary
        } else { // right
            currentScrollPosition -= scrollAmount;
            if (currentScrollPosition < -maxScroll) currentScrollPosition = -maxScroll; // Boundary
        }
        timeline.style.transform = `translateX(${currentScrollPosition}px)`;
    }

    scrollLeftButton.addEventListener('click', () => scrollTimeline('left'));
    scrollRightButton.addEventListener('click', () => scrollTimeline('right'));

    // --- Add Event Functionality ---
    addEventButton.addEventListener('click', () => {
        const year = parseInt(eventYearInput.value);
        const decadeStart = parseInt(eventDecadeSelect.value);
        const title = eventTitleInput.value.trim();
        const description = eventDescriptionInput.value.trim();
        const imageUrl = eventImageUrlInput.value.trim();

        if (!title) {
            alert('Please enter an event title.');
            return;
        }
        if (isNaN(decadeStart)) {
            alert('Please select a valid decade.');
            return;
        }
         if (year && (year < decadeStart || year >= decadeStart + 10)) {
            alert(`The year ${year} does not fall within the selected ${decadeStart}s decade.`);
            return;
        }


        addEventToTimeline(decadeStart, year || decadeStart, title, description, imageUrl);

        // Clear form fields
        eventYearInput.value = '';
        // eventDecadeSelect.value = ''; // Keep selected decade or reset
        eventTitleInput.value = '';
        eventDescriptionInput.value = '';
        eventImageUrlInput.value = '';
    });

    function addEventToTimeline(decade, eventFullYear, title, description, imageUrl) {
        const decadeMarker = timeline.querySelector(`.decade-marker[data-decade="${decade}"]`);
        if (!decadeMarker) {
            console.error(`Decade marker for ${decade} not found.`);
            return;
        }

        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = title + (eventFullYear !== decade ? ` (${eventFullYear})` : '');

        const eventDetails = document.createElement('div');
        eventDetails.classList.add('event-details');

        let detailsContent = `<strong>${title}</strong> (${eventFullYear})`;
        if (description) {
            detailsContent += `<p>${description}</p>`;
        }
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = title;
            eventDetails.appendChild(img);
        }
        const detailsText = document.createElement('div');
        detailsText.innerHTML = detailsContent; // Use innerHTML to parse the <p> tag
        eventDetails.insertBefore(detailsText, eventDetails.firstChild);


        eventElement.appendChild(eventDetails);

        // Simple hover to show details (can be improved with click, etc.)
        eventElement.addEventListener('mouseenter', () => eventDetails.style.display = 'block');
        eventElement.addEventListener('mouseleave', () => eventDetails.style.display = 'none');
        // Or click to toggle:
        // eventElement.addEventListener('click', () => {
        //     eventDetails.style.display = eventDetails.style.display === 'block' ? 'none' : 'block';
        // });


        decadeMarker.appendChild(eventElement);
    }

    // --- Initialize Timeline ---
    createTimelineMarkers();
});