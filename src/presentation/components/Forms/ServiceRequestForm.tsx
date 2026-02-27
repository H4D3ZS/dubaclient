'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
    Check, ChevronRight, ChevronLeft, Download, Phone, Mail,
    User, Building, Calendar, FileText, Wrench, Paintbrush,
    Wind, Zap, Droplets, Grid3X3, PanelTop, Hammer, Fence, Wallpaper,
    Clock, AlertTriangle, Sparkles
} from 'lucide-react';
import styles from './ServiceRequestForm.module.css';

interface FormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    emirate: string;
    propertyType: string;
    services: string[];
    preferredDate: string;
    preferredTime: string;
    urgency: string;
    description: string;
    additionalNotes: string;
}

const LICENSED_SERVICES = [
    { id: 'ac-ventilation', name: 'AC & Ventilation', icon: Wind, color: '#3b82f6' },
    { id: 'electromechanical', name: 'Electrical Work', icon: Zap, color: '#f59e0b' },
    { id: 'plaster', name: 'Plaster Works', icon: Hammer, color: '#8b5cf6' },
    { id: 'painting', name: 'Painting', icon: Paintbrush, color: '#ec4899' },
    { id: 'tiling', name: 'Tiling & Flooring', icon: Grid3X3, color: '#10b981' },
    { id: 'ceiling', name: 'Ceiling & Partitions', icon: PanelTop, color: '#06b6d4' },
    { id: 'carpentry', name: 'Carpentry', icon: Wrench, color: '#f97316' },
    { id: 'fencing', name: 'Fencing', icon: Fence, color: '#6366f1' },
    { id: 'wallpaper', name: 'Wallpaper', icon: Wallpaper, color: '#84cc16' },
];

const PROPERTY_TYPES = [
    { id: 'villa', name: 'Villa', icon: '🏡' },
    { id: 'apartment', name: 'Apartment', icon: '🏢' },
    { id: 'office', name: 'Office', icon: '🏛️' },
    { id: 'warehouse', name: 'Warehouse', icon: '🏭' },
    { id: 'shop', name: 'Retail Shop', icon: '🏪' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
];

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const TIME_SLOTS = [
    { id: 'morning', name: 'Morning', time: '8AM - 12PM', icon: '🌅' },
    { id: 'afternoon', name: 'Afternoon', time: '12PM - 5PM', icon: '☀️' },
    { id: 'evening', name: 'Evening', time: '5PM - 9PM', icon: '🌆' },
    { id: 'flexible', name: 'Flexible', time: 'Any time', icon: '📅' },
];

const generateReferenceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `QHP-${year}${month}-${random}`;
};

const saveToLocalStorage = (data: FormData & { referenceNumber: string; submittedAt: string }) => {
    const existing = localStorage.getItem('serviceRequests');
    const requests = existing ? JSON.parse(existing) : [];
    requests.push(data);
    localStorage.setItem('serviceRequests', JSON.stringify(requests));
};

const generatePDF = (data: FormData, referenceNumber: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(0, 82, 147);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Quick Hire Prime Technical Services L.L.C', pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('License No: 1587149 | Register No: 2781176', pageWidth / 2, 28, { align: 'center' });
    doc.text('Tel: +971 56 153 5466 | Email: info@quickhireprime.ae', pageWidth / 2, 35, { align: 'center' });

    doc.setTextColor(0, 82, 147);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE REQUEST', pageWidth / 2, 55, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Ref: ${referenceNumber}`, 20, 68);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 20, 68, { align: 'right' });

    doc.setDrawColor(0, 82, 147);
    doc.line(20, 73, pageWidth - 20, 73);

    let yPos = 85;
    doc.setTextColor(0, 82, 147);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details', 20, yPos);

    yPos += 10;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const customerDetails = [
        ['Name:', data.fullName],
        ['Phone:', data.phone],
        ['Email:', data.email],
        ['Emirate:', data.emirate],
        ['Property:', data.propertyType],
    ];

    customerDetails.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value || 'N/A', 55, yPos);
        yPos += 8;
    });

    yPos += 5;
    doc.setTextColor(0, 82, 147);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Selected Services', 20, yPos);

    yPos += 10;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);

    const selectedServices = LICENSED_SERVICES.filter(s => data.services.includes(s.id));
    selectedServices.forEach((service, index) => {
        doc.text(`• ${service.name}`, 25, yPos);
        yPos += 7;
    });

    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Schedule:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const timeSlot = TIME_SLOTS.find(t => t.id === data.preferredTime);
    doc.text(`${data.preferredDate} - ${timeSlot?.name || data.preferredTime}`, 55, yPos);

    if (data.description) {
        yPos += 15;
        doc.setTextColor(0, 82, 147);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Job Description', 20, yPos);

        yPos += 10;
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(data.description, pageWidth - 40);
        doc.text(descLines, 20, yPos);
    }

    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Quick Hire Prime Technical Services L.L.C - Dubai, UAE', pageWidth / 2, footerY, { align: 'center' });

    return doc;
};

export default function ServiceRequestForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState('');

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        emirate: 'Dubai',
        propertyType: '',
        services: [],
        preferredDate: '',
        preferredTime: '',
        urgency: 'regular',
        description: '',
        additionalNotes: '',
    });

    const updateField = (field: keyof FormData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleService = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(s => s !== serviceId)
                : [...prev.services, serviceId]
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const refNum = generateReferenceNumber();
        setReferenceNumber(refNum);

        // Save to localStorage as backup
        saveToLocalStorage({
            ...formData,
            referenceNumber: refNum,
            submittedAt: new Date().toISOString(),
        });

        // Submit to API
        try {
            await fetch('/api/service-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referenceNumber: refNum,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    emirate: formData.emirate,
                    address: formData.address,
                    propertyType: formData.propertyType,
                    services: formData.services,
                    preferredDate: formData.preferredDate,
                    preferredTime: formData.preferredTime,
                    urgency: formData.urgency,
                    description: formData.description,
                    additionalNotes: formData.additionalNotes,
                }),
            });
        } catch (error) {
            console.error('Failed to submit to API:', error);
            // Continue anyway - localStorage has the backup
        }

        // Generate and download PDF
        const pdf = generatePDF(formData, refNum);
        pdf.save(`ServiceRequest-${refNum}.pdf`);

        setIsSubmitting(false);
        setIsComplete(true);
    };


    const canProceed = () => {
        switch (step) {
            case 1: return formData.fullName && formData.phone && formData.email;
            case 2: return formData.services.length > 0;
            case 3: return formData.preferredDate && formData.preferredTime;
            default: return true;
        }
    };

    const resetForm = () => {
        setIsComplete(false);
        setStep(1);
        setFormData({
            fullName: '', phone: '', email: '', address: '', emirate: 'Dubai',
            propertyType: '', services: [], preferredDate: '', preferredTime: '',
            urgency: 'regular', description: '', additionalNotes: '',
        });
    };

    if (isComplete) {
        return (
            <div className={styles.successCard}>
                <div className={styles.successIconWrapper}>
                    <Sparkles className={styles.sparkle1} size={20} />
                    <div className={styles.successIcon}><Check size={40} /></div>
                    <Sparkles className={styles.sparkle2} size={20} />
                </div>
                <h2>Request Submitted!</h2>
                <div className={styles.refBadge}>{referenceNumber}</div>
                <p>Your PDF has been downloaded. We&apos;ll contact you within 24 hours.</p>
                <div className={styles.successActions}>
                    <a href="tel:+971561535466" className={styles.callBtn}>
                        <Phone size={18} /> Call Us Now
                    </a>
                    <button onClick={resetForm} className={styles.newBtn}>
                        New Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formWrapper}>
            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(step / 4) * 100}%` }} />
            </div>

            {/* Step Labels */}
            <div className={styles.stepLabels}>
                <span className={step >= 1 ? styles.active : ''}>Your Info</span>
                <span className={step >= 2 ? styles.active : ''}>Services</span>
                <span className={step >= 3 ? styles.active : ''}>Schedule</span>
                <span className={step >= 4 ? styles.active : ''}>Confirm</span>
            </div>

            {/* Step 1: Customer Info */}
            {step === 1 && (
                <div className={styles.stepPanel}>
                    <div className={styles.stepHeader}>
                        <User size={24} />
                        <div>
                            <h3>Tell us about yourself</h3>
                            <p>We&apos;ll use this to contact you about your request</p>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => updateField('fullName', e.target.value)}
                            placeholder="Enter your name"
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                placeholder="+971 XX XXX XXXX"
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="you@email.com"
                                className={styles.inputField}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Emirate</label>
                        <div className={styles.emirateChips}>
                            {EMIRATES.slice(0, 4).map(emirate => (
                                <button
                                    key={emirate}
                                    type="button"
                                    className={`${styles.chip} ${formData.emirate === emirate ? styles.chipActive : ''}`}
                                    onClick={() => updateField('emirate', emirate)}
                                >
                                    {emirate}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Property Type (Optional)</label>
                        <div className={styles.propertyCards}>
                            {PROPERTY_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    className={`${styles.propertyCard} ${formData.propertyType === type.id ? styles.propertyActive : ''}`}
                                    onClick={() => updateField('propertyType', type.id)}
                                >
                                    <span className={styles.propertyEmoji}>{type.icon}</span>
                                    <span>{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Services */}
            {step === 2 && (
                <div className={styles.stepPanel}>
                    <div className={styles.stepHeader}>
                        <Wrench size={24} />
                        <div>
                            <h3>What do you need?</h3>
                            <p>Select one or more services</p>
                        </div>
                    </div>

                    <div className={styles.serviceCards}>
                        {LICENSED_SERVICES.map(service => {
                            const Icon = service.icon;
                            const isSelected = formData.services.includes(service.id);
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    className={`${styles.serviceCard} ${isSelected ? styles.serviceActive : ''}`}
                                    onClick={() => toggleService(service.id)}
                                    style={{ '--service-color': service.color } as React.CSSProperties}
                                >
                                    <div className={styles.serviceIconWrap}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={styles.serviceName}>{service.name}</span>
                                    {isSelected && (
                                        <div className={styles.serviceCheck}>
                                            <Check size={14} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {formData.services.length > 0 && (
                        <div className={styles.selectedCount}>
                            {formData.services.length} service{formData.services.length > 1 ? 's' : ''} selected
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
                <div className={styles.stepPanel}>
                    <div className={styles.stepHeader}>
                        <Calendar size={24} />
                        <div>
                            <h3>When works for you?</h3>
                            <p>Pick a date and time slot</p>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Preferred Date</label>
                        <input
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => updateField('preferredDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Time Slot</label>
                        <div className={styles.timeCards}>
                            {TIME_SLOTS.map(slot => (
                                <button
                                    key={slot.id}
                                    type="button"
                                    className={`${styles.timeCard} ${formData.preferredTime === slot.id ? styles.timeActive : ''}`}
                                    onClick={() => updateField('preferredTime', slot.id)}
                                >
                                    <span className={styles.timeEmoji}>{slot.icon}</span>
                                    <span className={styles.timeName}>{slot.name}</span>
                                    <span className={styles.timeRange}>{slot.time}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Describe the work (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="Tell us more about what you need..."
                            className={styles.textareaField}
                            rows={3}
                        />
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className={styles.stepPanel}>
                    <div className={styles.stepHeader}>
                        <FileText size={24} />
                        <div>
                            <h3>Review your request</h3>
                            <p>Make sure everything looks good</p>
                        </div>
                    </div>

                    <div className={styles.reviewCard}>
                        <div className={styles.reviewRow}>
                            <span className={styles.reviewLabel}>Name</span>
                            <span className={styles.reviewValue}>{formData.fullName}</span>
                        </div>
                        <div className={styles.reviewRow}>
                            <span className={styles.reviewLabel}>Contact</span>
                            <span className={styles.reviewValue}>{formData.phone}</span>
                        </div>
                        <div className={styles.reviewRow}>
                            <span className={styles.reviewLabel}>Location</span>
                            <span className={styles.reviewValue}>{formData.emirate}</span>
                        </div>
                    </div>

                    <div className={styles.reviewCard}>
                        <div className={styles.reviewLabel} style={{ marginBottom: '0.75rem' }}>Services</div>
                        <div className={styles.reviewServices}>
                            {LICENSED_SERVICES.filter(s => formData.services.includes(s.id)).map(service => {
                                const Icon = service.icon;
                                return (
                                    <span key={service.id} className={styles.reviewServiceTag} style={{ '--service-color': service.color } as React.CSSProperties}>
                                        <Icon size={14} /> {service.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.reviewCard}>
                        <div className={styles.reviewRow}>
                            <span className={styles.reviewLabel}>Date</span>
                            <span className={styles.reviewValue}>{formData.preferredDate}</span>
                        </div>
                        <div className={styles.reviewRow}>
                            <span className={styles.reviewLabel}>Time</span>
                            <span className={styles.reviewValue}>
                                {TIME_SLOTS.find(t => t.id === formData.preferredTime)?.name}
                            </span>
                        </div>
                    </div>

                    <div className={styles.pdfBanner}>
                        <Download size={20} />
                        <span>A PDF will be downloaded with your request details</span>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className={styles.navBar}>
                {step > 1 && (
                    <button type="button" className={styles.backBtn} onClick={() => setStep(step - 1)}>
                        <ChevronLeft size={20} /> Back
                    </button>
                )}

                <div className={styles.navSpacer} />

                {step < 4 ? (
                    <button
                        type="button"
                        className={styles.nextBtn}
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                    >
                        Continue <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        type="button"
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Generating...' : 'Submit & Download'}
                        <Download size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
