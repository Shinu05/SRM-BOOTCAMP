import { Truck, ShieldCheck, Headphones, Award } from 'lucide-react';

const features = [
  {
    name: 'Free & Fast Delivery',
    description: 'Get your orders delivered to your doorstep quickly, securely, and for free.',
    icon: Truck,
  },
  {
    name: 'Premium Quality',
    description: 'Every product is handpicked and tested for the highest standards of quality.',
    icon: Award,
  },
  {
    name: 'Secure Payments',
    description: 'We process all transactions with enterprise-grade security and encryption.',
    icon: ShieldCheck,
  },
  {
    name: '24/7 Support',
    description: 'Our dedicated customer success team is here to help you around the clock.',
    icon: Headphones,
  },
];

export default function Features() {
  return (
    <section className="bg-secondary/30 py-16 sm:py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            The Atlas Experience.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted font-medium max-w-2xl mx-auto">
            We believe in providing more than just great products. Experience service that puts you first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground text-background mb-6 shadow-sm group-hover:-translate-y-1 transition-transform duration-300">
                <feature.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {feature.name}
              </h3>
              <p className="text-sm text-muted font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
