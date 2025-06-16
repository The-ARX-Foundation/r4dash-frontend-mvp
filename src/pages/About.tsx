
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/ui/navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About R4Dash
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Turn goodwill into impact—at scale
          </p>
        </div>

        {/* Story Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Howdy!</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <p>
              My name is Landon Dahle, but in creative circles I go by Elryan The Explorer. 
              I'm one of the co-developers behind the <strong>R4Dash</strong> and <strong>R4Go</strong> initiatives, 
              and I'd like to share how this project came to life.
            </p>

            <p>
              It started when I saw the incredible work Dan Van Atta had done with{' '}
              <a 
                href="https://wnc-supply-sites.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                WNC Supply Sites
                <ExternalLink className="w-3 h-3" />
              </a>
              —a lightweight coordination platform built in response to disaster logistics chaos. 
              Dan saw that supplies weren't reaching where they were most needed, and built a tool to help fix that. 
              It worked—really well.
            </p>

            <p>
              But as I saw how people engaged with that system, something else became clear:
            </p>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg font-semibold text-blue-900">
                There are <em>so many</em> people willing to volunteer—skilled, ready, and motivated—but 
                they have no idea where their time could make the most difference.
              </p>
            </div>

            <p>
              The problem isn't just about moving supplies.<br />
              It's about <strong>activating people</strong>.
            </p>

            <p>
              We need better coordination not only for logistics, but for <strong>human effort</strong>.
            </p>

            <p>
              That's what sparked the idea behind <strong>R4Dash</strong> and <strong>R4Go</strong>.
            </p>

            <p>
              What if we could apply the same logic that WNC used for supply chain redistribution… 
              to <strong>people</strong>?
            </p>
          </CardContent>
        </Card>

        {/* Vision Section */}
        <Card>
          <CardHeader>
            <CardTitle>The Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">What if we had a way to:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Show volunteers what needs exist in real time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Match them with tasks based on location, skills, and urgency</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Track and reward their contributions to grow trust and autonomy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Make participation <em>feel doable</em> and even <em>fun</em>—especially in overwhelming times</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">R4Dash</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The dashboard for organizers and coordinators to manage tasks, verify completion, and oversee community efforts.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">R4Go</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The street-level app for action, helping volunteers find and complete tasks in their community.</p>
            </CardContent>
          </Card>
        </div>

        {/* Modes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Two Modes of Operation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🆘</span>
              <div>
                <h3 className="font-semibold text-red-600">Disaster Mode</h3>
                <p className="text-gray-600">Where bandwidth is low and urgency is high</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">🌤</span>
              <div>
                <h3 className="font-semibold text-blue-600">Sunny Sky Mode</h3>
                <p className="text-gray-600">Where we can practice, improve, and build long-term civic infrastructure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-700 mb-6">
              To make <strong>volunteering scalable, transparent, and rewarding</strong>—even across 
              languages, devices, and disconnected zones.
            </p>
            <p className="text-lg text-gray-600">
              Let's make it easier to <em>show up</em> for each other—no matter the storm.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="text-center py-6">
            <h3 className="text-xl font-semibold mb-4">Get Involved</h3>
            <p className="text-gray-600 mb-6">
              If you're part of the Aid Arena network—or just someone passionate about community resilience—we're 
              looking for people to help co-develop, test, and refine this platform with us.
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Helping Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default About;
