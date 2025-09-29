import { motion } from 'framer-motion';
import { FileText, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Please read these terms carefully before using VibeMix.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Acceptance of Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using VibeMix, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">User Responsibilities</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>As a user of VibeMix, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and truthful information when creating your account</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Use the service in compliance with all applicable laws and regulations</li>
                  <li>Respect the intellectual property rights of others</li>
                </ul>
              </div>
            </section>

            <section className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Prohibited Activities</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>You may not use VibeMix to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Distribute malware or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </section>

            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to provide reliable service, but we cannot guarantee uninterrupted access. 
                We reserve the right to modify, suspend, or discontinue any part of the service 
                at any time without prior notice.
              </p>
            </section>

            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at 
                legal@vibemix.com or through our support channels.
              </p>
            </section>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}