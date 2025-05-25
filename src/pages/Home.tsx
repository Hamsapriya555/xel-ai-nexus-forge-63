import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Users, Zap, Brain, Code, Shield } from 'lucide-react';
import Button from '@/components/Button';
import AnimatedText from '@/components/AnimatedText';
import { staggeredDelay } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const whatIsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set loaded state after initial render
    setIsLoaded(true);
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
          entry.target.classList.remove('translate-y-10');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections that should animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Advanced Conversations",
      description: "Engage in natural, context-aware conversations with state-of-the-art language models."
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Intelligence Borrowing",
      description: "Tap into specialized AI knowledge domains without extensive training or setup."
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Developer Friendly",
      description: "Robust API with comprehensive documentation for seamless integration into your projects."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Community Driven",
      description: "Join a network of creators sharing insights, models, and collaborative projects."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption and privacy controls."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Lightning Fast",
      description: "Optimized infrastructure delivering responses with minimal latency."
    }
  ];

  const testimonials = [
    {
      quote: "fake_by_Xel has completely transformed how we approach content creation. The quality and speed are unmatched.",
      name: "Alex Rivera",
      title: "Creative Director",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Our development team's productivity doubled after integrating with fake_by_Xel's API. It feels like having an AI expert on the team.",
      name: "Sarah Chen",
      title: "Lead Developer",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The community aspect of fake_by_Xel is what sets it apart. I've connected with brilliant minds across industries.",
      name: "Marcus Johnson",
      title: "AI Researcher",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`pt-32 pb-20 px-6 relative overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 grid-background opacity-40 z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <div 
              className="mb-6 inline-block relative transition-all duration-700 ease-out transform"
              style={{ 
                transitionDelay: '0.2s',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <span className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                Now in public beta
              </span>
            </div>
            
            <div 
              className="transition-all duration-700 ease-out transform mb-6"
              style={{ 
                transitionDelay: '0.4s',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold leading-tight">
                <span className="text-gradient">Borrow intelligence.</span><br />
                <span>{user ? `Welcome back, ${user.email?.split('@')[0]}` : 'Build ideas. Welcome to Xel.'}</span>
              </h1>
            </div>
            
            <div 
              className="transition-all duration-700 ease-out transform mb-10"
              style={{ 
                transitionDelay: '0.6s',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {user 
                  ? "Continue your conversation where you left off or start a new chat." 
                  : "Access cutting-edge language models, engage in natural conversations, and join a community of creators pushing the boundaries of AI."}
              </p>
            </div>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 transition-all duration-700 ease-out transform"
              style={{ 
                transitionDelay: '0.8s',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <Link to={user ? "/chat" : "/login"}>
                <Button variant="glow" size="lg" className="group">
                  {user ? "Continue chatting" : "Start chatting now"}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </Link>
              <Link to={user ? "/community" : "/login"}>
                <Button variant="outline" size="lg">
                  {user ? "Explore community" : "Join community"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is fake_by_Xel section */}
      <section ref={whatIsRef} className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-6">
                What is <span className="text-gradient">fake_by_Xel</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                fake_by_Xel is a next-generation AI platform that lets you borrow intelligence 
                from specialized language models. Unlike traditional AI services, we focus on
                creating a collaborative ecosystem where humans and AI work together.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform provides intuitive interfaces for natural conversations,
                API access for developers, and a community space to share and build together.
              </p>
              <div className="mt-8">
                <Link to="/chat">
                  <Button variant="outline" className="group">
                    Try it yourself
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-on-scroll opacity-0 translate-y-10 transition-all duration-700" style={{ transitionDelay: '0.2s' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-xl blur-md opacity-30"></div>
              <div className="bg-card rounded-xl p-8 relative border border-border">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <span className="font-mono text-primary">X</span>
                    </div>
                    <p className="bg-muted/50 rounded-lg p-3 text-sm">
                      Welcome to fake_by_Xel. How can I assist your creativity today?
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <p className="bg-primary/10 rounded-lg p-3 text-sm mr-4">
                      I need help designing a futuristic user interface
                    </p>
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="font-mono text-secondary">U</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <span className="font-mono text-primary">X</span>
                    </div>
                    <p className="bg-muted/50 rounded-lg p-3 text-sm">
                      I'd recommend starting with a dark mode interface using glowing accents and 
                      subtle motion. For interaction, consider neuromorphic elements that respond 
                      to user input with fluid animations...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-6">
              Why Borrow an <span className="text-gradient">LLM</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers unparalleled capabilities designed for creators,
              developers, researchers, and everyday users.
            </p>
          </div>
          
          <div 
            ref={featureCardsRef} 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-muted/20 border border-border rounded-xl p-6 transition-all hover:shadow-glow-sm animate-on-scroll opacity-0 translate-y-10"
                style={{ 
                  transitionDelay: staggeredDelay(index),
                  transitionDuration: '700ms',
                }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialRef} 
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-6">
              What Our <span className="text-gradient">Community</span> Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who are transforming their work with fake_by_Xel.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-card border border-border rounded-xl p-6 animate-on-scroll opacity-0 translate-y-10 transition-all"
                style={{ 
                  transitionDelay: staggeredDelay(index),
                  transitionDuration: '700ms'
                }}
              >
                <div className="mb-4 text-primary">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-lg mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/20 mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-12 w-12 rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Only show if not logged in */}
      {!user && (
        <section ref={ctaRef} className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-30"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-6">
              Join Our <span className="text-gradient">Community</span> Today
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect with like-minded creators, developers, and thinkers who are
              exploring the frontiers of AI-assisted creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="glow" size="lg">
                  Sign up for free
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" size="lg">
                  Explore community
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
