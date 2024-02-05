import { Inter } from 'next/font/google'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function Home_Page() {
  return (
    <main>
    <section id="profile">
        <div className="section-container">
            <div className="section__text">
                <p className="section__text__p1">We Are</p>
                <h1 className="title">Bot Name</h1>
                <p className="section__text__p2">Crypto Bot</p>
                <div className="btn-container">
                    
                <button
                    className="btn btn-color-1 repo-btn"
                    onClick={() => window.location.href = 'https://github.com/0xBcamp/Kyle-janus-dragon'}
                >
                    Github Repo
                </button>
                </div>
            </div>
        </div>
        <Image
            src="/images/arrow.png"
            alt="Arrow icon"
            width={20}
            height={20}
            className="icon arrow"
            onClick={() => window.location.href = './#about'}
        />

    </section>
    <section id="about">
        <p className="section__text__p1">Get To Know More</p>
        <h1 className="title">About Us</h1>
        <div className="section-container">
            <div className="about-details-container">
                <div className="about-containers">
                    <div className="details-container">
                        <Image 
                            src="/images/experience.png" 
                            alt="Experience icon" 
                            className="icon"
                            width={32} height={32}
                        />
                        <h3>Insights</h3>
                        <p>Streamline Dune's queries for actionable notifications.</p>
                    </div>
                    <div className="details-container">
                        <Image 
                            src="/images/education.png" 
                            alt="Education icon" 
                            width={32} height={32}
                            className="icon"
                        />
                        <h3>User-Defined Alerts</h3>
                        <p>Tailor notifications to specific criteria effortlessly.</p>
                    </div>
                </div>
                <div className="text-container">
                    <p>
                        Welcome to our innovative chatbot platform, where we bridge the gap between complex data and user convenience. With empowering insights," we provide a seamless interface to navigate Dune's intricate query system. Users can effortlessly set up personalized alerts with user-defined alerts, ensuring they stay informed when critical thresholds are met. Our mission is to empower users with actionable insights, making data-driven decisions a breeze. Experience the future of data interaction with our intuitive and efficient chatbot solution.
                    </p>
                </div>
            </div>
        </div>
        <Image
            src="/images/arrow.png"
            alt="Arrow icon"
            width={20}
            height={20}
            className="icon arrow"
            onClick={() => window.location.href = './#team'}
        />
    </section>
    <section id="team">
        <p className="section__text__p1">Meet The</p>
        <h1 className="title">Team</h1>
        <div className="experience-details-container">
            <div className="about-containers">
                <div className="details-container color-container">
                    <div className="article-container">
                        <Image 
                            src="/images/danielha-pic.png" 
                            alt="Daniel Ha pic" 
                            className="team-img"
                            fill={true}
                        />
                    </div>
                    <h2 className="experience-sub-title team-title team-member name">Daniel Ha</h2>
                    <h3 className="experience-sub-title team-title role team-member-role">Scrum Master</h3>
                    <h3 className="experience-sub-title team-title role team-member-role">Backend Software Engineer</h3>
                    <div className="btn-container">
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://www.linkedin.com/in/daniel-ha-554ba8180/', '_blank')}>
                            Linkedin
                        </button>
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://github.com/daniel-ha', '_blank')}>
                            Github
                        </button>
                    </div>
                </div>
                <div className="details-container color-container">
                    <div className="article-container">
                        <Image 
                            src="/images/danielbird-pic.png" 
                            alt="Daniel Bird pic" 
                            className="team-img"
                            fill={true}
                        />
                    </div>
                    <h2 className="experience-sub-title team-title team-member name">Daniel Bird</h2>
                    <h3 className="experience-sub-title team-title role team-member-role">Product Owner</h3>
                    <h3 className="experience-sub-title team-title role team-member-role">Fullstack Software Engineer</h3>
                    <div className="btn-container">
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://www.linkedin.com/in/danielbirdjr', '_blank')}>
                            Linkedin
                        </button>
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://github.com/danielbirdjr', '_blank')}>
                            Github
                        </button>
                    </div>
                </div>
                <div className="details-container color-container">
                    <div className="article-container">
                        <Image 
                            src="/images/adamgill-pic.png" 
                            alt="Adam Gill pic" 
                            className="team-img"
                            fill={true}
                        />
                    </div>
                    <h2 className="experience-sub-title team-title">Adam Gill</h2>
                    <h3 className="experience-sub-title team-title role team-member-role">Product Owner</h3>
                    <h3 className="experience-sub-title team-title role team-member-role">Fullstack Software Engineer</h3>
                    <div className="btn-container">
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://www.linkedin.com/in/adam-gill-614346264/', '_blank')}>
                            LinkedIn
                        </button>
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://github.com/adam-gill', '_blank')}>
                            Github
                        </button>
                    </div>
                </div>
                <div className="details-container color-container">
                    <div className="article-container">
                        <Image 
                            src="/images/dontepalmer-pic.png" 
                            alt="Donte Palmer pic" 
                            className="team-img"
                            fill={true}
                        />
                    </div>
                    <h2 className="experience-sub-title team-title">Donte Palmer</h2>
                    <h3 className="experience-sub-title team-title role team-member-role">Backend Software Engineer</h3>
                    <h3 className="experience-sub-title team-title role team-member-role">Security Specialist</h3>
                    <div className="btn-container">
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://www.linkedin.com/in/dontepalmer/', '_blank')}>
                            LinkedIn
                        </button>
                        <button className="btn btn-color-2 team-btn" onClick={() => window.open('https://github.com/solesprung', '_blank')}>
                            Github
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Image
            src="/images/arrow.png"
            alt="Arrow icon"
            width={20}
            height={20}
            className="icon arrow"
            onClick={() => window.location.href = './#contact'}
        />
    </section>
    <section id="contact">
        <p className="section__text__p1">Get in Touch</p>
        <h1 className="title">Contact Us</h1>
        <div className="contact-info-upper-container">
            <div className="contact-info-container">
                <p><a href="mailto:Example@gmail.com">Example@gmail.com</a></p>
            </div>
        </div>
    </section>
    <footer>
        <nav>
            <div className="nav-links-container">
                <ul className="nav-links">
                    <li><a href="#try_me">Try Me</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#team">Team</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
        <p>Copyright &#169; 2024 Bot Name.</p>
    </footer>
    </main>
  )
}


