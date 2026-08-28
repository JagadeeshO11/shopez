import React from 'react'
import '../styles/Home.css'
import Products from '../components/Products'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { FiChevronRight, FiClock, FiZap, FiTruck, FiShield, FiCreditCard } from 'react-icons/fi'
import homeBanner1 from '../images/home-banner1.png'
import homeBanner2 from '../images/home-banner-2.png'

const categories = [
  { name: 'Fashion', image: homeBanner2 },
  { name: 'Electronics', image: 'https://5.imimg.com/data5/ANDROID/Default/2023/1/SE/QC/NG/63182719/product-jpeg-500x500.jpg' },
  { name: 'Mobiles', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3jUW7v1WFJL9Ylax9a4vazyKXwG-ktSinI4Rd7qi7MkhMr79UlIyyrNkbiK0Cz5u6WYw&usqp=CAU' },
  { name: 'Groceries', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbpV_yQ_zCtZt_1kNebjvFqXvdDnLuuJPsQ&usqp=CAU' },
  { name: 'Sports', image: 'https://a.storyblok.com/f/112937/568x464/82f66c3a21/all_the_english-_football_terms_you_need_to_know_blog-hero-low.jpg/m/620x0/filters:quality(70)/' },
]

const scrollToProducts = () => document.getElementById('products-body')?.scrollIntoView({ behavior: 'smooth' })

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="HomePage">
      <section className="store-strip">
        <div><span className="dot" /> Deals refreshed daily</div>
        <div className="store-strip-right"><span><FiTruck /> Fast delivery</span><span><FiShield /> Secure checkout</span></div>
      </section>

      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow">SHOP SMART • SHOP EASY</span>
          <h1>Everything you need,<br /><strong>priced to move.</strong></h1>
          <p>Explore trending products, sharp deals and everyday essentials in one clean storefront.</p>
          <div className="hero-actions">
            <button onClick={scrollToProducts} className="primary-cta">Shop Now <FiChevronRight /></button>
            <span className="hero-note"><FiZap /> Fresh deals are live</span>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src={homeBanner1} alt="ShopEZ featured offers" />
          <div className="hero-floating-card"><span><FiClock /> Limited-time picks</span><strong>Save more. Scroll less.</strong></div>
        </div>
      </section>

      <section className="category-bar">
        <div className="section-heading compact-heading"><h2>Shop by category</h2><span>Popular picks for you</span></div>
        <div className="category-row">
          {categories.map((category) => (
            <button key={category.name} className="category-tile" onClick={() => navigate(`/category/${category.name}`)}>
              <span className="category-image"><img src={category.image} alt={category.name} /></span>
              <span className="category-name">{category.name}</span>
              <span className="category-sub">Explore now</span>
            </button>
          ))}
        </div>
      </section>

      <section className="quick-benefits">
        <div><FiTruck /><span><strong>Fast delivery</strong>Reliable shipping</span></div>
        <div><FiShield /><span><strong>Safe shopping</strong>Secure payments</span></div>
        <div><FiCreditCard /><span><strong>Easy payments</strong>Simple checkout</span></div>
        <div><FiZap /><span><strong>Daily deals</strong>Fresh offers</span></div>
      </section>

      <section id="products-body" className="products-section-shell">
        <div className="section-heading"><div><h2>Top picks for you</h2><p>Popular products worth a closer look</p></div><button onClick={scrollToProducts}>View all <FiChevronRight /></button></div>
        <Products category="all" />
      </section>

      <section className="promo-grid">
        <div className="promo-card promo-dark"><span>WEEKEND PICKS</span><h3>Big finds.<br />Better prices.</h3><p>Build your cart around products you actually want.</p><button onClick={scrollToProducts}>Explore deals <FiChevronRight /></button></div>
        <div className="promo-card promo-light"><span>NEW ON SHOPEZ</span><h3>Fresh arrivals<br />are here.</h3><p>Discover new categories and customer favourites.</p><button onClick={scrollToProducts}>See what's new <FiChevronRight /></button></div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
