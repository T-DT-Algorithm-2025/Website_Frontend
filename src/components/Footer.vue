<template>
  <footer class="ftco-footer">
    <div class="footer-content">
      <div class="footer-row">
        <div class="footer-col text-center">
          <p class="copyright">Copyright &copy; 2025.T-DT创新实验室 All rights reserved.</p>
          <p class="copyright">辽ICP备2024045383号-1</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ftco-footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 2rem 0;
  margin-top: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-col {
  text-align: center;
  width: 100%;
}

.copyright {
  font-size: 1rem;
  color: #ccc;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.beian-link {
  color: #f8b400;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(248, 180, 0, 0.1);
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.beian-link:hover {
  color: #ff6b35;
  background: rgba(248, 180, 0, 0.2);
  border-color: rgba(248, 180, 0, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ftco-footer {
    padding: 1.5rem 0;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .copyright {
    font-size: 0.9rem;
  }
  
  .beian-link {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .ftco-footer {
    padding: 1rem 0;
  }
  
  .copyright {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  .beian-link {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
