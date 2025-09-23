 let selectedRating = 0;
        let reviews = [
            {
                id: 1,
                userName: "Maria Silva",
                product: "Smartphone Premium",
                rating: 5,
                comment: "Produto incrível! A qualidade da câmera é excepcional e a bateria dura o dia todo. Recomendo muito!",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                userName: "João Santos",
                product: "Notebook Gamer",
                rating: 4,
                comment: "Excelente desempenho para jogos. O único ponto negativo é que esquenta um pouco durante uso intenso, mas nada que comprometa.",
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                userName: "Ana Costa",
                product: "Fone Bluetooth",
                rating: 5,
                comment: "Som cristalino e conexão estável. Uso para trabalhar e ouvir música, perfeito para ambos. Muito confortável!",
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        ];

        function initStarRating() {
            const stars = document.querySelectorAll('.star');
            const ratingText = document.getElementById('ratingText');
            
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    selectedRating = parseInt(this.dataset.rating);
                    updateStarDisplay();
                    updateRatingText();
                });
                
                star.addEventListener('mouseover', function() {
                    const hoverRating = parseInt(this.dataset.rating);
                    highlightStars(hoverRating);
                });
            });
            
            document.getElementById('starRating').addEventListener('mouseleave', function() {
                updateStarDisplay();
            });
        }
        
        function highlightStars(rating) {
            const stars = document.querySelectorAll('.star');
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('text-gray-300');
                    star.classList.add('text-yellow-400');
                } else {
                    star.classList.remove('text-yellow-400');
                    star.classList.add('text-gray-300');
                }
            });
        }
        
        function updateStarDisplay() {
            highlightStars(selectedRating);
        }
        
        function updateRatingText() {
            const ratingText = document.getElementById('ratingText');
            const ratingLabels = {
                0: 'Clique nas estrelas para avaliar',
                1: '⭐ Muito Ruim',
                2: '⭐⭐ Ruim',
                3: '⭐⭐⭐ Regular',
                4: '⭐⭐⭐⭐ Bom',
                5: '⭐⭐⭐⭐⭐ Excelente'
            };
            ratingText.textContent = ratingLabels[selectedRating];
        }
        
        function submitReview() {
            const userName = document.getElementById('userName').value.trim();
            const product = document.getElementById('productSelect').value;
            const comment = document.getElementById('reviewComment').value.trim();
            
            if (!userName) {
                showNotification('Por favor, digite seu nome!', 'error');
                return;
            }
            
            if (selectedRating === 0) {
                showNotification('Por favor, selecione uma avaliação!', 'error');
                return;
            }
            
            if (!comment) {
                showNotification('Por favor, escreva um comentário!', 'error');
                return;
            }
            
            const newReview = {
                id: reviews.length + 1,
                userName: userName,
                product: product,
                rating: selectedRating,
                comment: comment,
                date: new Date()
            };
            
            reviews.unshift(newReview);
            
            // Clear form
            document.getElementById('userName').value = '';
            document.getElementById('reviewComment').value = '';
            selectedRating = 0;
            updateStarDisplay();
            updateRatingText();
            
            // Update displays
            displayReviews();
            updateStats();
            showNotification('Avaliação enviada com sucesso!', 'success');
        }
        
        function displayReviews() {
            const reviewsList = document.getElementById('reviewsList');
            const emptyState = document.getElementById('emptyState');
            const productFilter = document.getElementById('filterProduct').value;
            const ratingFilter = document.getElementById('filterRating').value;
            
            let filteredReviews = reviews;
            
            if (productFilter !== 'all') {
                filteredReviews = filteredReviews.filter(review => review.product === productFilter);
            }
            
            if (ratingFilter !== 'all') {
                filteredReviews = filteredReviews.filter(review => review.rating === parseInt(ratingFilter));
            }
            
            if (filteredReviews.length === 0) {
                reviewsList.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }
            
            emptyState.classList.add('hidden');
            
            reviewsList.innerHTML = filteredReviews.map((review, index) => {
                const starsHtml = generateStarsHtml(review.rating);
                const timeAgo = getTimeAgo(review.date);
                
                return `
                    <div class="review-card bg-white rounded-2xl shadow-lg p-6 slide-in" style="animation-delay: ${index * 0.1}s">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span class="text-white font-bold text-lg">${review.userName.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-800">${review.userName}</h4>
                                    <p class="text-gray-600 text-sm">${review.product}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="flex items-center space-x-1 mb-1">
                                    ${starsHtml}
                                </div>
                                <div class="text-gray-500 text-xs">${timeAgo}</div>
                            </div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-gray-700 leading-relaxed">"${review.comment}"</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function generateStarsHtml(rating) {
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    starsHtml += '<span class="text-yellow-400 text-lg">★</span>';
                } else {
                    starsHtml += '<span class="text-gray-300 text-lg">★</span>';
                }
            }
            return starsHtml;
        }
        
        function getTimeAgo(date) {
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            
            if (diffDays > 0) {
                return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
            } else if (diffHours > 0) {
                return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
            } else if (diffMinutes > 0) {
                return `há ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
            } else {
                return 'agora mesmo';
            }
        }
        
        function filterReviews() {
            displayReviews();
        }
        
        function updateStats() {
            if (reviews.length === 0) return;
            
            const totalReviews = reviews.length;
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = (totalRating / totalReviews).toFixed(1);
            const recommendationRate = Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100);
            
            document.getElementById('averageRating').textContent = averageRating;
            document.getElementById('totalReviews').textContent = totalReviews;
            document.getElementById('recommendationRate').textContent = recommendationRate + '%';
            
            // Update average stars display
            const avgStarsContainer = document.getElementById('averageStars');
            avgStarsContainer.innerHTML = `<span class="text-yellow-400 text-xl">${generateStarsHtml(Math.round(averageRating))}</span>`;
        }
        
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const icon = document.getElementById('notificationIcon');
            const text = document.getElementById('notificationText');
            
            text.textContent = message;
            
            if (type === 'error') {
                notification.className = 'notification fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
                icon.textContent = '❌';
            } else {
                notification.className = 'notification fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
                icon.textContent = '✅';
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Initialize the system
        function init() {
            initStarRating();
            displayReviews();
            updateStats();
        }

        // Start when page loads
        window.addEventListener('load', init);
