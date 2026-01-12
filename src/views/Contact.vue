<template>
  <div>
    
    <h2>Let’s build something fun together!</h2>

    <div style="margin-bottom:40px;">I’m a Unity Developer passionate about creating games that feel great to play. If you’re hiring or want to collaborate, I’d love to connect.</div>

    <div class="contact-grid">
      <a class="contact-card" href="https://TheVayuputra.github.io" target="_blank" rel="noopener">
        <div class="contact-icon">
          <i class="fa fa-user-circle-o"></i>
        </div>
        <div class="contact-content">
          <h3>Website</h3>
          <div class="contact-text">TheVayuputra.github.io</div>
        </div>
      </a>
      
      <a class="contact-card" href="mailto:vayuputra.developer@gmail.com" target="_blank" rel="noopener">
        <div class="contact-icon">
          <i class="fa fa-envelope-o"></i>
        </div>
        <div class="contact-content">
          <h3>Email</h3>
          <div class="contact-text">vayuputra.developer@gmail.com</div>
        </div>
      </a>
    </div>

  </div>
</template>

<style scoped>
/* Grid similar to About.vue languages section */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 24px;
}

@media only screen and (min-width: 640px) {
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media only screen and (min-width: 900px) {
  .contact-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.contact-card {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(59, 130, 246, 0.05));
  border: 2px solid rgba(236, 72, 153, 0.2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
}

.contact-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transition: left 0.6s ease;
}

.contact-card:hover::after {
  left: 100%;
}

.contact-card:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(59, 130, 246, 0.08));
  border-color: rgba(236, 72, 153, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(236, 72, 153, 0.25);
}

.contact-icon {
  font-size: 3.5rem;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.15));
  border-radius: 20px;
  transition: all 0.4s ease;
  border: 2px solid rgba(236, 72, 153, 0.3);
  margin-bottom: 8px;
}

.contact-card:hover .contact-icon {
  transform: scale(1.15) rotate(5deg);
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.25));
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.contact-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
}

.contact-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
  word-break: break-word;
}

@media only screen and (max-width: 640px) {
  .contact-card {
    padding: 20px;
    gap: 14px;
  }
  
  .contact-icon {
    width: 70px;
    height: 70px;
    font-size: 3rem;
  }
  
  .contact-content h3 {
    font-size: 1.1rem;
  }
}
</style>
