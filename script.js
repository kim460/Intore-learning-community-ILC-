// Dark mode detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    // Navigation scroll effect
    const navbar = document.getElementById('navbar');

    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll);

    // Mobile menu
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav a, .mobile-cta a');

    function openMobileMenu() {
      mobileMenu.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      successModal.classList.add('active');
      contactForm.reset();
    });

    modalClose.addEventListener('click', function() {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Set min date for contact form date inputs
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);

    checkInInput.addEventListener('change', function() {
      checkOutInput.setAttribute('min', this.value);
      if (checkOutInput.value && checkOutInput.value < this.value) {
        checkOutInput.value = this.value;
      }
    });

    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.value-card, .room-card, .experience-card, .testimonial-card, .why-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // =====================
    // BOOKING SYSTEM
    // =====================

    // Room inventory with availability
    const roomInventory = [
      {
        id: 'single-deluxe',
        name: 'Single Deluxe Room',
        type: 'single',
        icon: 'fa-bed',
        description: 'Private room with ensuite bathroom, perfect for solo travelers',
        price: 65,
        capacity: 1,
        totalRooms: 8,
        features: ['Private Bathroom', 'Free Wi-Fi', 'Hot Water', 'Daily Housekeeping']
      },
      {
        id: 'single-standard',
        name: 'Single Standard Room',
        type: 'single',
        icon: 'fa-bed',
        description: 'Comfortable single room with shared facilities',
        price: 45,
        capacity: 1,
        totalRooms: 6,
        features: ['Shared Bathroom', 'Free Wi-Fi', 'Hot Water']
      },
      {
        id: 'double-room',
        name: 'Double Room',
        type: 'shared',
        icon: 'fa-user-friends',
        description: 'Spacious room with double bed for couples',
        price: 85,
        capacity: 2,
        totalRooms: 10,
        features: ['Private Bathroom', 'Free Wi-Fi', 'Double Bed', 'Balcony']
      },
      {
        id: 'twin-room',
        name: 'Twin Room',
        type: 'shared',
        icon: 'fa-user-friends',
        description: 'Two single beds, ideal for colleagues or friends',
        price: 80,
        capacity: 2,
        totalRooms: 8,
        features: ['Private Bathroom', 'Free Wi-Fi', 'Two Single Beds']
      },
      {
        id: 'family-room',
        name: 'Family Room',
        type: 'shared',
        icon: 'fa-users',
        description: 'Large room with one double and two single beds',
        price: 120,
        capacity: 4,
        totalRooms: 4,
        features: ['Private Bathroom', 'Free Wi-Fi', 'Family-Friendly']
      },
      {
        id: 'dorm-bed',
        name: 'Dormitory Bed',
        type: 'dorm',
        icon: 'fa-users',
        description: 'Single bed in shared dormitory (6 beds per room)',
        price: 25,
        capacity: 1,
        totalRooms: 24,
        features: ['Shared Bathroom', 'Free Wi-Fi', 'Secure Locker']
      }
    ];

    // Simulated bookings (for demo - would come from database in production)
    const existingBookings = [
      { roomId: 'single-deluxe', date: getDateStr(1), count: 3 },
      { roomId: 'single-deluxe', date: getDateStr(2), count: 5 },
      { roomId: 'double-room', date: getDateStr(1), count: 8 },
      { roomId: 'double-room', date: getDateStr(2), count: 10 },
      { roomId: 'family-room', date: getDateStr(3), count: 4 },
    ];

    function getDateStr(daysFromNow) {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date.toISOString().split('T')[0];
    }

    // Booking state
    let bookingState = {
      checkIn: null,
      checkOut: null,
      adults: 1,
      children: 0,
      nights: 0,
      selectedRoom: null,
      selectedServices: [],
      guestInfo: {}
    };

    // DOM Elements
    const bookingModal = document.getElementById('bookingModal');
    const bookingClose = document.getElementById('bookingClose');
    const bookingCheckIn = document.getElementById('bookingCheckIn');
    const bookingCheckOut = document.getElementById('bookingCheckOut');
    const bookingAdults = document.getElementById('bookingAdults');
    const bookingChildren = document.getElementById('bookingChildren');
    const staySummary = document.getElementById('staySummary');
    const nightCount = document.getElementById('nightCount');
    const availableRooms = document.getElementById('availableRooms');

    // Initialize booking date inputs
    bookingCheckIn.setAttribute('min', today);
    bookingCheckOut.setAttribute('min', today);

    // Open booking modal
    function openBookingModal() {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      resetBooking();
    }

    // Close booking modal
    function closeBookingModal() {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Reset booking state
    function resetBooking() {
      bookingState = {
        checkIn: null,
        checkOut: null,
        adults: 1,
        children: 0,
        nights: 0,
        selectedRoom: null,
        selectedServices: [],
        guestInfo: {}
      };

      // Reset form fields
      bookingCheckIn.value = '';
      bookingCheckOut.value = '';
      bookingAdults.value = '1';
      bookingChildren.value = '0';
      staySummary.style.display = 'none';

      // Reset service toggles
      document.querySelectorAll('.service-toggle input').forEach(cb => {
        cb.checked = false;
      });
      document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
      });

      // Reset guest form
      document.getElementById('guestFirstName').value = '';
      document.getElementById('guestLastName').value = '';
      document.getElementById('guestEmail').value = '';
      document.getElementById('guestPhone').value = '';
      document.getElementById('guestRequests').value = '';

      // Go to step 1
      goToStep(1);
    }

    // Calculate nights between dates
    function calculateNights(checkIn, checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }

    // Update stay summary
    function updateStaySummary() {
      if (bookingCheckIn.value && bookingCheckOut.value) {
        const nights = calculateNights(bookingCheckIn.value, bookingCheckOut.value);
        if (nights > 0) {
          bookingState.nights = nights;
          bookingState.checkIn = bookingCheckIn.value;
          bookingState.checkOut = bookingCheckOut.value;
          nightCount.textContent = nights + (nights === 1 ? ' night' : ' nights');
          staySummary.style.display = 'flex';
        } else {
          staySummary.style.display = 'none';
        }
      } else {
        staySummary.style.display = 'none';
      }
    }

    // Check room availability for date range
    function getRoomAvailability(roomId, checkIn, checkOut) {
      const room = roomInventory.find(r => r.id === roomId);
      if (!room) return 0;

      let minAvailable = room.totalRooms;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      for (let i = 0; i < dayCount; i++) {
        const checkDate = new Date(start);
        checkDate.setDate(checkDate.getDate() + i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const booking = existingBookings.find(b => b.roomId === roomId && b.date === dateStr);
        const booked = booking ? booking.count : 0;
        const available = room.totalRooms - booked;
        if (available < minAvailable) {
          minAvailable = available;
        }
      }

      return Math.max(0, minAvailable);
    }

    // Render available rooms
    function renderAvailableRooms() {
      const totalGuests = bookingState.adults + bookingState.children;

      let html = '';
      roomInventory.forEach(room => {
        const available = getRoomAvailability(room.id, bookingState.checkIn, bookingState.checkOut);
        const isUnavailable = available === 0;
        const isSelected = bookingState.selectedRoom && bookingState.selectedRoom.id === room.id;

        let badge = '';
        if (isUnavailable) {
          badge = '<span class="badge sold-out">Sold Out</span>';
        } else if (available <= 2) {
          badge = '<span class="badge">Only ' + available + ' left!</span>';
        } else {
          badge = '<span class="badge">' + available + ' Available</span>';
        }

        html += `
          <div class="room-option ${isSelected ? 'selected' : ''} ${isUnavailable ? 'unavailable' : ''}"
               data-room-id="${room.id}" ${isUnavailable ? '' : 'onclick="selectRoom(\'' + room.id + '\')"'}>
            <div class="room-option-icon">
              <i class="fas ${room.icon}"></i>
            </div>
            <div class="room-option-info">
              <h4>${room.name} ${badge}</h4>
              <p>${room.description}</p>
            </div>
            <div class="room-option-price">
              <span class="price">$${room.price}</span>
              <span class="per-night">/ night</span>
            </div>
            <div class="room-option-check">
              <i class="fas fa-check"></i>
            </div>
          </div>
        `;
      });

      availableRooms.innerHTML = html;
    }

    // Select a room
    function selectRoom(roomId) {
      const room = roomInventory.find(r => r.id === roomId);
      if (!room) return;

      bookingState.selectedRoom = room;

      // Update UI
      document.querySelectorAll('.room-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      document.querySelector(`[data-room-id="${roomId}"]`).classList.add('selected');

      // Enable continue button
      document.getElementById('toStep3').disabled = false;
    }

    // Go to specific step
    function goToStep(stepNum) {
      // Update progress indicators
      document.querySelectorAll('.progress-step').forEach(step => {
        const num = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (num < stepNum) {
          step.classList.add('completed');
        } else if (num === stepNum) {
          step.classList.add('active');
        }
      });

      // Show correct step content
      document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
      });

      if (stepNum === 5) {
        document.getElementById('stepSuccess').classList.add('active');
      } else {
        document.getElementById('step' + stepNum).classList.add('active');
      }

      // Scroll to top of modal
      document.querySelector('.booking-modal').scrollTop = 0;
    }

    // Update booking summary
    function updateBookingSummary() {
      // Format dates
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const checkInDate = new Date(bookingState.checkIn).toLocaleDateString('en-US', options);
      const checkOutDate = new Date(bookingState.checkOut).toLocaleDateString('en-US', options);

      document.getElementById('summaryCheckIn').textContent = checkInDate;
      document.getElementById('summaryCheckOut').textContent = checkOutDate;
      document.getElementById('summaryNights').textContent = bookingState.nights + (bookingState.nights === 1 ? ' night' : ' nights');
      document.getElementById('summaryGuests').textContent = bookingState.adults + ' Adults' +
        (bookingState.children > 0 ? ', ' + bookingState.children + ' Children' : '');

      // Room info
      const roomTotal = bookingState.selectedRoom.price * bookingState.nights;
      document.getElementById('summaryRoom').innerHTML = `
        <span class="room-name">${bookingState.selectedRoom.name}</span>
        <span class="room-price">$${bookingState.selectedRoom.price} × ${bookingState.nights} nights = $${roomTotal}</span>
      `;

      // Services
      const servicesSection = document.getElementById('summaryServicesSection');
      const servicesContainer = document.getElementById('summaryServices');

      if (bookingState.selectedServices.length > 0) {
        servicesSection.style.display = 'block';
        let servicesHtml = '';
        bookingState.selectedServices.forEach(service => {
          servicesHtml += `
            <div class="summary-row">
              <span>${service.name}</span>
              <strong>$${service.total}</strong>
            </div>
          `;
        });
        servicesContainer.innerHTML = servicesHtml;
      } else {
        servicesSection.style.display = 'none';
      }

      // Calculate total
      let total = roomTotal;
      bookingState.selectedServices.forEach(s => total += s.total);
      document.getElementById('summaryTotal').textContent = '$' + total;
    }

    // Collect selected services
    function collectSelectedServices() {
      bookingState.selectedServices = [];
      const totalGuests = bookingState.adults + bookingState.children;

      document.querySelectorAll('.service-card').forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
          const service = card.dataset.service;
          const basePrice = parseInt(card.dataset.price);
          let total = basePrice;
          let name = '';

          switch(service) {
            case 'meals':
              total = basePrice * totalGuests * bookingState.nights;
              name = 'Full Board Meals';
              break;
            case 'tour':
              total = basePrice * totalGuests;
              name = 'Village Tour';
              break;
            case 'cultural':
              total = basePrice * totalGuests;
              name = 'Cultural Experience';
              break;
            case 'transfer':
              total = basePrice;
              name = 'Airport Transfer';
              break;
            case 'conference':
              total = basePrice * bookingState.nights;
              name = 'Conference Room';
              break;
            case 'laundry':
              total = basePrice;
              name = 'Laundry Service';
              break;
          }

          bookingState.selectedServices.push({ service, name, total });
        }
      });
    }

    // Generate booking reference
    function generateBookingRef() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let ref = 'ILC-';
      for (let i = 0; i < 6; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return ref;
    }

    // Validate step before proceeding
    function validateStep(stepNum) {
      if (stepNum === 1) {
        if (!bookingCheckIn.value || !bookingCheckOut.value) {
          showNotification('Please select check-in and check-out dates', 'error');
          return false;
        }
        if (bookingState.nights < 1) {
          showNotification('Check-out date must be after check-in date', 'error');
          return false;
        }
        return true;
      }
      if (stepNum === 2) {
        if (!bookingState.selectedRoom) {
          showNotification('Please select a room', 'error');
          return false;
        }
        return true;
      }
      if (stepNum === 4) {
        const firstName = document.getElementById('guestFirstName').value.trim();
        const lastName = document.getElementById('guestLastName').value.trim();
        const email = document.getElementById('guestEmail').value.trim();
        const phone = document.getElementById('guestPhone').value.trim();

        if (!firstName || !lastName || !email || !phone) {
          showNotification('Please fill in all required guest information', 'error');
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showNotification('Please enter a valid email address', 'error');
          return false;
        }

        bookingState.guestInfo = { firstName, lastName, email, phone };
        return true;
      }
      return true;
    }

    // Show notification
    function showNotification(message, type) {
      const existing = document.querySelector('.notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = 'notification ' + type;
      notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
      `;
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        z-index: 3000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: fadeInUp 0.3s ease;
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    // Event Listeners
    bookingClose.addEventListener('click', closeBookingModal);
    bookingModal.addEventListener('click', function(e) {
      if (e.target === bookingModal) closeBookingModal();
    });

    // Booking buttons
    document.querySelectorAll('[href="#contact"].btn-primary, .room-btn.btn-primary').forEach(btn => {
      if (btn.textContent.includes('Book')) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          openBookingModal();
        });
      }
    });

    // Nav book button
    document.querySelector('.nav-cta').addEventListener('click', function(e) {
      e.preventDefault();
      openBookingModal();
    });

    // Hero book button
    document.querySelector('.hero-buttons .btn-primary').addEventListener('click', function(e) {
      e.preventDefault();
      openBookingModal();
    });

    // Date change handlers
    bookingCheckIn.addEventListener('change', function() {
      bookingCheckOut.setAttribute('min', this.value);
      if (bookingCheckOut.value && bookingCheckOut.value <= this.value) {
        const nextDay = new Date(this.value);
        nextDay.setDate(nextDay.getDate() + 1);
        bookingCheckOut.value = nextDay.toISOString().split('T')[0];
      }
      updateStaySummary();
    });

    bookingCheckOut.addEventListener('change', updateStaySummary);

    // Guest count handlers
    bookingAdults.addEventListener('change', function() {
      bookingState.adults = parseInt(this.value) || 1;
    });

    bookingChildren.addEventListener('change', function() {
      bookingState.children = parseInt(this.value) || 0;
    });

    // Step navigation
    document.getElementById('cancelBooking').addEventListener('click', closeBookingModal);

    document.getElementById('toStep2').addEventListener('click', function() {
      if (validateStep(1)) {
        bookingState.adults = parseInt(bookingAdults.value) || 1;
        bookingState.children = parseInt(bookingChildren.value) || 0;
        renderAvailableRooms();
        document.getElementById('toStep3').disabled = true;
        goToStep(2);
      }
    });

    document.getElementById('backToStep1').addEventListener('click', function() {
      goToStep(1);
    });

    document.getElementById('toStep3').addEventListener('click', function() {
      if (validateStep(2)) {
        goToStep(3);
      }
    });

    document.getElementById('backToStep2').addEventListener('click', function() {
      goToStep(2);
    });

    document.getElementById('toStep4').addEventListener('click', function() {
      collectSelectedServices();
      updateBookingSummary();
      goToStep(4);
    });

    document.getElementById('backToStep3').addEventListener('click', function() {
      goToStep(3);
    });

    document.getElementById('confirmBooking').addEventListener('click', function() {
      if (validateStep(4)) {
        // Generate booking reference
        const ref = generateBookingRef();
        document.getElementById('bookingRef').textContent = ref;
        document.getElementById('confirmEmail').textContent = bookingState.guestInfo.email;

        // Simulate saving booking (in production, this would be an API call)
        console.log('Booking submitted:', {
          reference: ref,
          ...bookingState
        });

        goToStep(5);
      }
    });

    document.getElementById('closeSuccess').addEventListener('click', function() {
      closeBookingModal();
    });

    // Service card toggle
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
          const checkbox = this.querySelector('input[type="checkbox"]');
          checkbox.checked = !checkbox.checked;
          this.classList.toggle('selected', checkbox.checked);
        }
      });

      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', function() {
        card.classList.toggle('selected', this.checked);
      });
    });
  