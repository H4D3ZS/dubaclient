'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { Search, Filter, RefreshCw, Download, Clock, CheckCircle, XCircle, AlertCircle, Trash2, UserPlus, Calendar, MapPin, Wrench, User, Users } from 'lucide-react';

interface ServiceRequest {
    id: number;
    reference_number: string;
    full_name: string;
    phone: string;
    email: string;
    emirate: string;
    address: string;
    property_type: string;
    services: string[];
    preferred_date: string;
    preferred_time: string;
    urgency: string;
    description?: string;
    additional_notes?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    assigned_to?: string;
    created_at: string;
    updated_at: string;
}

export default function AdminPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<{id: number, name: string, email: string, role: string} | null>(null);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [serviceFilter, setServiceFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'requests' | 'analytics' | 'users'>('requests'); // Added view mode state
    const [showUserModal, setShowUserModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<ServiceRequest | null>(null);
    const [editingUser, setEditingUser] = useState<{id?: number, name: string, email: string, role: string} | null>(null);
    const [technicians] = useState([
        { id: 1, name: 'Ahmed Hassan', specialty: 'AC Services' },
        { id: 2, name: 'Mohammed Ali', specialty: 'Electrical Work' },
        { id: 3, name: 'Omar Farooq', specialty: 'Plumbing' },
        { id: 4, name: 'Ali Rashed', specialty: 'Renovation' },
        { id: 5, name: 'Khalid Yousif', specialty: 'Handyman Services' },
        { id: 6, name: 'Saeed Abdullah', specialty: 'Painting' },
        { id: 7, name: 'Fahad Salem', specialty: 'Fit-Out Works' },
        { id: 8, name: 'Nasser Rashid', specialty: 'Pool Maintenance' },
    ]);
    const [users, setUsers] = useState([
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { id: 2, name: 'Manager User', email: 'manager@example.com', role: 'manager' },
    ]);
    const [notifications, setNotifications] = useState<{id: number, message: string, type: string}[]>([]);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (searchTerm) params.set('search', searchTerm);
            if (dateRange.start) params.set('start_date', dateRange.start);
            if (dateRange.end) params.set('end_date', dateRange.end);
            if (serviceFilter !== 'all') params.set('service', serviceFilter);
            if (locationFilter !== 'all') params.set('location', locationFilter);

            const res = await fetch(`/api/service-requests?${params}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError('Failed to fetch service requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        const delay = searchTerm ? 300 : 0;
        const timeout = setTimeout(() => {
            fetchRequests();
        }, delay);
        return () => clearTimeout(timeout);
    }, [
        isAuthenticated,
        statusFilter,
        searchTerm,
        dateRange.start,
        dateRange.end,
        serviceFilter,
        locationFilter,
    ]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // In a real application, we would call an API endpoint here
            // For now, we'll simulate the authentication
            if (loginForm.password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123')) {
                // Find user based on email
                const mockUsers = [
                    { id: 1, name: 'Admin User', email: 'admin@quickhireprime.ae', role: 'admin' },
                    { id: 2, name: 'Staff User', email: 'staff@quickhireprime.ae', role: 'staff' }
                ];
                
                const user = mockUsers.find(u => u.email === loginForm.email);
                
                if (user) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                } else {
                    alert('Invalid credentials');
                }
            } else {
                alert('Incorrect password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/service-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchRequests();
                if (selectedRequest?.id === id) {
                    const updated = await res.json();
                    setSelectedRequest(updated);
                }
                addNotification(`Request status updated to ${newStatus}`, 'success');
            } else {
                addNotification('Failed to update request status', 'error');
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            addNotification('Failed to update request status', 'error');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className={styles.statusIcon} />;
            case 'confirmed': return <AlertCircle className={styles.statusIcon} />;
            case 'completed': return <CheckCircle className={styles.statusIcon} />;
            case 'cancelled': return <XCircle className={styles.statusIcon} />;
            default: return null;
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        confirmed: requests.filter(r => r.status === 'confirmed').length,
        completed: requests.filter(r => r.status === 'completed').length,
    };

    const exportToCSV = (data: ServiceRequest[]) => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Define CSV headers
        const headers = [
            'ID', 'Reference Number', 'Full Name', 'Phone', 'Email', 
            'Emirate', 'Address', 'Property Type', 'Services', 
            'Preferred Date', 'Preferred Time', 'Urgency', 
            'Description', 'Additional Notes', 'Status', 
            'Assigned To', 'Created At', 'Updated At'
        ];

        // Convert data to CSV format
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.id,
                `"${item.reference_number}"`,
                `"${item.full_name}"`,
                `"${item.phone}"`,
                `"${item.email}"`,
                `"${item.emirate}"`,
                `"${item.address}"`,
                `"${item.property_type}"`,
                `"${item.services.join('; ')}"`,
                `"${item.preferred_date}"`,
                `"${item.preferred_time}"`,
                `"${item.urgency}"`,
                `"${item.description || ''}"`,
                `"${item.additional_notes || ''}"`,
                `"${item.status}"`,
                `"${item.assigned_to || ''}"`,
                `"${item.created_at}"`,
                `"${item.updated_at}"`
            ].join(','))
        ].join('\n');

        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `service_requests_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleRequestSelection = (id: number) => {
        setSelectedRequests(prev => 
            prev.includes(id) 
                ? prev.filter(reqId => reqId !== id) 
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRequests.length === requests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(requests.map(req => req.id));
        }
    };

    const bulkUpdateStatus = async (newStatus: string) => {
        if (selectedRequests.length === 0) return;

        try {
            const promises = selectedRequests.map(id =>
                fetch(`/api/service-requests/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                })
            );

            await Promise.all(promises);
            fetchRequests(); // Refresh the list
            setSelectedRequests([]); // Clear selection
            setShowBulkActions(false); // Hide bulk actions
            addNotification(`${selectedRequests.length} requests status updated to ${newStatus}`, 'success');
        } catch (err) {
            console.error('Failed to update statuses:', err);
            addNotification('Failed to update request statuses', 'error');
        }
    };

    const bulkDelete = async () => {
        if (selectedRequests.length === 0) return;

        if (!confirm(`Are you sure you want to delete ${selectedRequests.length} request(s)?`)) {
            return;
        }

        try {
            const promises = selectedRequests.map(id =>
                fetch(`/api/service-requests/${id}`, {
                    method: 'DELETE',
                })
            );

            await Promise.all(promises);
            fetchRequests(); // Refresh the list
            setSelectedRequests([]); // Clear selection
            setShowBulkActions(false); // Hide bulk actions
            addNotification(`${selectedRequests.length} requests deleted successfully`, 'success');
        } catch (err) {
            console.error('Failed to delete requests:', err);
            addNotification('Failed to delete requests', 'error');
        }
    };

    const assignTechnician = async (requestId: number, technicianName: string) => {
        try {
            const res = await fetch(`/api/service-requests/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedTo: technicianName }),
            });

            if (res.ok) {
                fetchRequests(); // Refresh the list
                if (selectedRequest?.id === requestId) {
                    const updated = await res.json();
                    setSelectedRequest(updated);
                }
            }
        } catch (err) {
            console.error('Failed to assign technician:', err);
        }
    };

    const bulkAssignTechnician = async (technicianName: string) => {
        if (selectedRequests.length === 0) return;

        try {
            const promises = selectedRequests.map(id =>
                fetch(`/api/service-requests/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assignedTo: technicianName }),
                })
            );

            await Promise.all(promises);
            fetchRequests(); // Refresh the list
            setSelectedRequests([]); // Clear selection
            setShowBulkActions(false); // Hide bulk actions
            addNotification(`${selectedRequests.length} requests assigned to ${technicianName}`, 'success');
        } catch (err) {
            console.error('Failed to assign technician to requests:', err);
            addNotification('Failed to assign technicians', 'error');
        }
    };

    const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    // Analytics functions
    const getAnalyticsData = () => {
        const totalRequests = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const confirmed = requests.filter(r => r.status === 'confirmed').length;
        const completed = requests.filter(r => r.status === 'completed').length;
        const cancelled = requests.filter(r => r.status === 'cancelled').length;

        // Calculate completion rate
        const completionRate = totalRequests > 0 
            ? Math.round(((completed + confirmed) / totalRequests) * 100) 
            : 0;

        // Group by service type
        const serviceCounts: Record<string, number> = {};
        requests.forEach(request => {
            request.services.forEach(service => {
                serviceCounts[service] = (serviceCounts[service] || 0) + 1;
            });
        });

        // Group by location
        const locationCounts: Record<string, number> = {};
        requests.forEach(request => {
            const location = request.emirate || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });

        // Calculate average response time (time from creation to confirmation)
        let avgResponseTime = 0;
        if (requests.some(r => r.status !== 'pending')) {
            const confirmedRequests = requests.filter(r => r.status !== 'pending');
            const totalTime = confirmedRequests.reduce((sum, req) => {
                // Calculate time difference in hours
                const created = new Date(req.created_at).getTime();
                const updated = new Date(req.updated_at).getTime();
                return sum + ((updated - created) / (1000 * 60 * 60)); // Convert to hours
            }, 0);
            avgResponseTime = confirmedRequests.length > 0 
                ? parseFloat((totalTime / confirmedRequests.length).toFixed(2))
                : 0;
        }

        return {
            totalRequests,
            pending,
            confirmed,
            completed,
            cancelled,
            completionRate,
            serviceCounts,
            locationCounts,
            avgResponseTime
        };
    };

    // User management functions
    const addUser = (userData: {name: string, email: string, role: string}) => {
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData
        };
        setUsers([...users, newUser]);
        addNotification('User added successfully', 'success');
    };

    const updateUser = (userData: {id: number, name: string, email: string, role: string}) => {
        setUsers(users.map(user => user.id === userData.id ? userData : user));
        addNotification('User updated successfully', 'success');
    };

    const deleteUser = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
            addNotification('User deleted successfully', 'success');
        }
    };

    const openAddUserModal = () => {
        setEditingUser({ name: '', email: '', role: 'manager' });
        setShowUserModal(true);
    };

    const openEditUserModal = (user: typeof users[0]) => {
        setEditingUser(user);
        setShowUserModal(true);
    };

    // Service request management functions
    const openCreateRequestModal = () => {
        setCurrentRequest({
            id: 0, // Will be ignored when creating
            reference_number: `REQ-${Date.now()}`,
            full_name: '',
            phone: '',
            email: '',
            emirate: 'Dubai',
            address: '',
            property_type: 'Apartment',
            services: [],
            preferred_date: new Date().toISOString().split('T')[0],
            preferred_time: '09:00',
            urgency: 'normal',
            description: '',
            additional_notes: '',
            status: 'pending',
            assigned_to: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setShowRequestModal(true);
    };

    const openEditRequestModal = (request: ServiceRequest) => {
        setCurrentRequest(request);
        setShowRequestModal(true);
    };

    const saveRequest = async () => {
        if (!currentRequest) return;

        try {
            let res;
            if (currentRequest.id === 0) {
                // Creating new request
                res = await fetch('/api/service-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        referenceNumber: currentRequest.reference_number,
                        fullName: currentRequest.full_name,
                        phone: currentRequest.phone,
                        email: currentRequest.email,
                        emirate: currentRequest.emirate,
                        address: currentRequest.address,
                        propertyType: currentRequest.property_type,
                        services: currentRequest.services,
                        preferredDate: currentRequest.preferred_date,
                        preferredTime: currentRequest.preferred_time,
                        urgency: currentRequest.urgency,
                        description: currentRequest.description,
                        additionalNotes: currentRequest.additional_notes,
                        status: currentRequest.status,
                        assignedTo: currentRequest.assigned_to,
                    })
                });
            } else {
                // Updating existing request
                res = await fetch(`/api/service-requests/${currentRequest.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentRequest)
                });
            }

            if (res.ok) {
                fetchRequests(); // Refresh the list
                setShowRequestModal(false);
                addNotification(
                    currentRequest.id === 0 ? 'Request created successfully' : 'Request updated successfully', 
                    'success'
                );
            } else {
                addNotification('Failed to save request', 'error');
            }
        } catch (err) {
            console.error('Error saving request:', err);
            addNotification('Error saving request', 'error');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <form onSubmit={handleLogin} className={styles.loginForm}>
                    <h1>Admin Portal</h1>
                    <p>Sign in to access the dashboard</p>
                    <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        placeholder="Email"
                        className={styles.emailInput}
                        required
                    />
                    <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        placeholder="Password"
                        className={styles.passwordInput}
                        required
                    />
                    <button type="submit" className={styles.loginButton}>Login</button>
                    <div className={styles.loginNote}>
                        <p>Admin: admin@quickhireprime.ae / admin123</p>
                        <p>Staff: staff@quickhireprime.ae / admin123</p>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Notifications */}
            <div className={styles.notifications}>
                {notifications.map(notification => (
                    <div 
                        key={notification.id} 
                        className={`${styles.notification} ${styles[`notification-${notification.type}`]}`}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
            
            <header className={styles.header}>
                <div>
                    <h1>
                        {viewMode === 'analytics' 
                            ? 'Analytics Dashboard' 
                            : viewMode === 'users'
                                ? 'User Management'
                                : 'Service Requests'}
                    </h1>
                    <p>Quick Hire Prime Technical Services L.L.C</p>
                </div>
                <div className={styles.headerActions}>
                    {currentUser?.role === 'admin' && (
                        <button 
                            onClick={() => setViewMode(viewMode === 'requests' ? 'analytics' : 'requests')} 
                            className={styles.viewToggle}
                        >
                            {viewMode === 'requests' ? 'View Analytics' : 'View Requests'}
                        </button>
                    )}
                    {currentUser?.role === 'admin' && (
                        <button 
                            onClick={() => setViewMode(viewMode === 'users' ? 'requests' : 'users')} 
                            className={styles.viewToggle}
                        >
                            {viewMode === 'users' ? 'View Requests' : 'Manage Users'}
                        </button>
                    )}
                    {currentUser?.role === 'admin' || currentUser?.role === 'staff' ? (
                        <button
                            onClick={() => window.location.href = '/admin/chat'}
                            className={styles.viewToggle}
                        >
                            Live Chat Support
                        </button>
                    ) : null}
                    {viewMode === 'requests' && currentUser?.role === 'admin' && (
                        <button onClick={openCreateRequestModal} className={styles.createButton}>
                            <UserPlus size={18} /> Create Request
                        </button>
                    )}
                    <button onClick={fetchRequests} className={styles.refreshButton}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                    {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
                        <button onClick={() => exportToCSV(requests)} className={styles.exportButton}>
                            <Download size={18} /> Export CSV
                        </button>
                    )}
                    <div className={styles.userProfile}>
                        <span className={styles.userName}>{currentUser?.name}</span>
                        <span className={`${styles.userBadge} ${styles[currentUser?.role || '']}`}>{currentUser?.role}</span>
                        <button onClick={() => {
                            setIsAuthenticated(false);
                            setCurrentUser(null);
                        }} className={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{stats.total}</span>
                    <span className={styles.statLabel}>Total Requests</span>
                </div>
                <div className={`${styles.statCard} ${styles.pending}`}>
                    <span className={styles.statNumber}>{stats.pending}</span>
                    <span className={styles.statLabel}>Pending</span>
                </div>
                <div className={`${styles.statCard} ${styles.confirmed}`}>
                    <span className={styles.statNumber}>{stats.confirmed}</span>
                    <span className={styles.statLabel}>Confirmed</span>
                </div>
                <div className={`${styles.statCard} ${styles.completed}`}>
                    <span className={styles.statNumber}>{stats.completed}</span>
                    <span className={styles.statLabel}>Completed</span>
                </div>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
                    />
                </div>
                <div className={styles.filterBox}>
                    <Filter size={18} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                {selectedRequests.length > 0 && (
                    <div className={styles.bulkActions}>
                        <button 
                            type="button" 
                            onClick={() => setShowBulkActions(!showBulkActions)}
                            className={styles.bulkActionsButton}
                        >
                            {showBulkActions ? 'Hide' : 'Show'} Bulk Actions ({selectedRequests.length})
                        </button>
                        {showBulkActions && (
                            <div className={styles.bulkActionsDropdown}>
                                <button 
                                    type="button" 
                                    onClick={() => bulkUpdateStatus('confirmed')}
                                    className={styles.bulkActionBtn}
                                >
                                    Confirm Selected
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => bulkUpdateStatus('completed')}
                                    className={styles.bulkActionBtn}
                                >
                                    Mark as Completed
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => bulkUpdateStatus('cancelled')}
                                    className={styles.bulkActionBtn}
                                >
                                    Cancel Selected
                                </button>
                                <div className={styles.assignTechDropdown}>
                                    <label>Assign to Technician:</label>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                bulkAssignTechnician(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Choose technician...</option>
                                        {technicians.map(tech => (
                                            <option key={tech.id} value={tech.name}>
                                                {tech.name} ({tech.specialty})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={bulkDelete}
                                    className={`${styles.bulkActionBtn} ${styles.danger}`}
                                >
                                    Delete Selected
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div className={styles.advancedFilters}>
                    <div className={styles.dateFilter}>
                        <Calendar size={16} />
                        <input
                            type="date"
                            placeholder="Start date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        />
                        <span>to</span>
                        <input
                            type="date"
                            placeholder="End date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        />
                    </div>
                    <div className={styles.serviceFilter}>
                        <Wrench size={16} />
                        <select 
                            value={serviceFilter} 
                            onChange={(e) => setServiceFilter(e.target.value)}
                        >
                            <option value="all">All Services</option>
                            <option value="AC Services">AC Services</option>
                            <option value="Electrical Work">Electrical Work</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Home Renovation">Home Renovation</option>
                            <option value="Handyman Services">Handyman Services</option>
                            <option value="Painting & Decor">Painting & Decor</option>
                            <option value="Fit-Out Works">Fit-Out Works</option>
                            <option value="Pool & Tank Services">Pool & Tank Services</option>
                        </select>
                    </div>
                    <div className={styles.locationFilter}>
                        <MapPin size={16} />
                        <select 
                            value={locationFilter} 
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="all">All Locations</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Abu Dhabi">Abu Dhabi</option>
                            <option value="Sharjah">Sharjah</option>
                            <option value="Ajman">Ajman</option>
                            <option value="Fujairah">Fujairah</option>
                            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                            <option value="Umm Al Quwain">Umm Al Quwain</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {viewMode === 'analytics' ? (
                // Analytics Dashboard
                <div className={styles.analyticsDashboard}>
                    <div className={styles.analyticsStats}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{getAnalyticsData().totalRequests}</span>
                            <span className={styles.statLabel}>Total Requests</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.pending}`}>
                            <span className={styles.statNumber}>{getAnalyticsData().pending}</span>
                            <span className={styles.statLabel}>Pending</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.confirmed}`}>
                            <span className={styles.statNumber}>{getAnalyticsData().confirmed}</span>
                            <span className={styles.statLabel}>Confirmed</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.completed}`}>
                            <span className={styles.statNumber}>{getAnalyticsData().completed}</span>
                            <span className={styles.statLabel}>Completed</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{getAnalyticsData().completionRate}%</span>
                            <span className={styles.statLabel}>Completion Rate</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{getAnalyticsData().avgResponseTime} hrs</span>
                            <span className={styles.statLabel}>Avg Response Time</span>
                        </div>
                    </div>

                    <div className={styles.analyticsCharts}>
                        <div className={styles.chartContainer}>
                            <h3>Requests by Service Type</h3>
                            <div className={styles.barChart}>
                                {Object.entries(getAnalyticsData().serviceCounts).map(([service, count]) => (
                                    <div key={service} className={styles.barItem}>
                                        <div className={styles.barLabel}>{service}</div>
                                        <div className={styles.barValue}>{count}</div>
                                        <div 
                                            className={styles.barFill} 
                                            style={{ width: `${Math.min(100, (count / Math.max(...Object.values(getAnalyticsData().serviceCounts))) * 100)}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.chartContainer}>
                            <h3>Requests by Location</h3>
                            <div className={styles.barChart}>
                                {Object.entries(getAnalyticsData().locationCounts).map(([location, count]) => (
                                    <div key={location} className={styles.barItem}>
                                        <div className={styles.barLabel}>{location}</div>
                                        <div className={styles.barValue}>{count}</div>
                                        <div 
                                            className={styles.barFill} 
                                            style={{ width: `${Math.min(100, (count / Math.max(...Object.values(getAnalyticsData().locationCounts))) * 100)}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : viewMode === 'users' && currentUser?.role === 'admin' ? (
                // User Management Dashboard
                <div className={styles.userManagement}>
                    <div className={styles.userActions}>
                        <button onClick={openAddUserModal} className={styles.addButton}>
                            <UserPlus size={18} /> Add User
                        </button>
                    </div>
                    
                    <div className={styles.userTable}>
                        <div className={styles.tableHeader}>
                            <div className={styles.columnHeader}>Name</div>
                            <div className={styles.columnHeader}>Email</div>
                            <div className={styles.columnHeader}>Role</div>
                            <div className={styles.columnHeader}>Actions</div>
                        </div>
                        
                        {users.map(user => (
                            <div key={user.id} className={styles.tableRow}>
                                <div className={styles.tableCell}>{user.name}</div>
                                <div className={styles.tableCell}>{user.email}</div>
                                <div className={styles.tableCell}>
                                    <span className={`${styles.badge} ${styles[user.role]}`}>{user.role}</span>
                                </div>
                                <div className={styles.tableCell}>
                                    <button 
                                        onClick={() => openEditUserModal(user)}
                                        className={styles.actionButton}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteUser(user.id)}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : viewMode === 'users' && currentUser?.role !== 'admin' ? (
                // Unauthorized access message for non-admin users
                <div className={styles.unauthorized}>
                    <h2>Access Denied</h2>
                    <p>You don't have permission to view this section. Only administrators can manage users.</p>
                </div>
            ) : (
                // Main requests view - accessible to both admin and staff
                <div className={styles.content}>
                    <div className={styles.requestsList}>
                        {loading ? (
                            <div className={styles.loading}>Loading...</div>
                        ) : requests.length === 0 ? (
                            <div className={styles.empty}>No requests found</div>
                        ) : (
                            <>
                                {/* Only show bulk actions and selection for admin users */}
                                {currentUser?.role === 'admin' && (
                                    <div className={styles.selectAllRow}>
                                        <label className={styles.selectAllLabel}>
                                            <input
                                                type="checkbox"
                                                checked={requests.length > 0 && selectedRequests.length === requests.length}
                                                onChange={toggleSelectAll}
                                            />
                                            <span>Select All</span>
                                        </label>
                                    </div>
                                )}
                                {requests.map(request => (
                                    <div
                                        key={request.id}
                                        className={`${styles.requestCard} ${selectedRequest?.id === request.id ? styles.selected : ''} ${currentUser?.role === 'admin' && selectedRequests.includes(request.id) ? styles.selectedForBulk : ''}`}
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        <div className={styles.requestHeader}>
                                            {/* Only show checkbox for admin users */}
                                            {currentUser?.role === 'admin' && (
                                                <label className={styles.checkboxLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRequests.includes(request.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            toggleRequestSelection(request.id);
                                                        }}
                                                    />
                                                </label>
                                            )}
                                            <span className={styles.refNumber}>{request.reference_number}</span>
                                            <span className={`${styles.status} ${styles[request.status]}`}>
                                                {getStatusIcon(request.status)} {request.status}
                                            </span>
                                        </div>
                                        <div className={styles.requestInfo}>
                                            <strong>{request.full_name}</strong>
                                            <span>{request.phone}</span>
                                        </div>
                                        <div className={styles.requestMeta}>
                                            <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                            <span>{request.services?.length || 0} services</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {selectedRequest && (
                        <div className={styles.detailPanel}>
                            <h2>Request Details</h2>
                            <div className={styles.detailSection}>
                                <h3>Reference</h3>
                                <p>{selectedRequest.reference_number}</p>
                            </div>
                            <div className={styles.detailSection}>
                                <h3>Customer</h3>
                                <p><strong>{selectedRequest.full_name}</strong></p>
                                <p>{selectedRequest.phone}</p>
                                <p>{selectedRequest.email}</p>
                                <p>{selectedRequest.address}, {selectedRequest.emirate}</p>
                                
                                {/* Contact buttons for staff to reach out to customers */}
                                <div className={styles.contactActions}>
                                    <a href={`tel:${selectedRequest.phone}`} className={styles.contactButton}>
                                        Call Customer
                                    </a>
                                    <a href={`mailto:${selectedRequest.email}`} className={styles.contactButton}>
                                        Email Customer
                                    </a>
                                    <button 
                                        onClick={() => {
                                            // In a real application, this would open a messaging interface
                                            alert(`Message sent to ${selectedRequest.full_name} at ${selectedRequest.phone}`);
                                        }}
                                        className={styles.contactButton}
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                            <div className={styles.detailSection}>
                                <h3>Services</h3>
                                <ul>
                                    {selectedRequest.services?.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div className={styles.detailSection}>
                                <h3>Schedule</h3>
                                <p>{selectedRequest.preferred_date} at {selectedRequest.preferred_time}</p>
                                <p>Urgency: {selectedRequest.urgency}</p>
                            </div>
                            
                            {/* Show status and assignment controls for both admin and staff */}
                            {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
                                <>
                                    <div className={styles.detailSection}>
                                        <h3>Current Status</h3>
                                        <p className={`${styles.statusDisplay} ${styles[selectedRequest.status]}`}>
                                            {getStatusIcon(selectedRequest.status)} {selectedRequest.status}
                                        </p>
                                    </div>
                                    <div className={styles.detailSection}>
                                        <h3>Assigned Technician</h3>
                                        <p>{selectedRequest.assigned_to || 'Not assigned'}</p>
                                    </div>
                                </>
                            )}
                            
                            {/* Only show status and assignment controls for admin users */}
                            {currentUser?.role === 'admin' && (
                                <>
                                    <div className={styles.detailSection}>
                                        <h3>Update Status</h3>
                                        <select
                                            value={selectedRequest.status}
                                            onChange={(e) => updateStatus(selectedRequest.id, e.target.value)}
                                            className={styles.statusSelect}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className={styles.detailSection}>
                                        <h3>Assign Technician</h3>
                                        <select
                                            value={selectedRequest.assigned_to || ''}
                                            onChange={(e) => assignTechnician(selectedRequest.id, e.target.value)}
                                            className={styles.statusSelect}
                                        >
                                            <option value="">Select Technician</option>
                                            {technicians.map(tech => (
                                                <option key={tech.id} value={tech.name}>
                                                    {tech.name} ({tech.specialty})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {/* User Modal */}
            {showUserModal && editingUser && (
                <div className={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>{editingUser.id ? 'Edit User' : 'Add New User'}</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="userName">Name</label>
                            <input
                                id="userName"
                                type="text"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                className={styles.formInput}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="userEmail">Email</label>
                            <input
                                id="userEmail"
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                className={styles.formInput}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="userRole">Role</label>
                            <select
                                id="userRole"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                className={styles.formInput}
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        
                        <div className={styles.modalActions}>
                            <button 
                                onClick={() => {
                                    if (editingUser.id) {
                                        updateUser({id: editingUser.id, name: editingUser.name, email: editingUser.email, role: editingUser.role});
                                    } else {
                                        addUser({name: editingUser.name, email: editingUser.email, role: editingUser.role});
                                    }
                                    setShowUserModal(false);
                                }}
                                className={styles.saveButton}
                            >
                                {editingUser.id ? 'Update User' : 'Add User'}
                            </button>
                            <button 
                                onClick={() => setShowUserModal(false)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Service Request Modal */}
            {showRequestModal && currentRequest && (
                <div className={styles.modalOverlay} onClick={() => setShowRequestModal(false)}>
                    <div className={styles.requestModalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>{currentRequest.id === 0 ? 'Create New Request' : 'Edit Request'}</h2>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="refNumber">Reference Number</label>
                                <input
                                    id="refNumber"
                                    type="text"
                                    value={currentRequest.reference_number}
                                    onChange={(e) => setCurrentRequest({...currentRequest, reference_number: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={currentRequest.status}
                                    onChange={(e) => setCurrentRequest({...currentRequest, status: e.target.value as any})}
                                    className={styles.formInput}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={currentRequest.full_name}
                                    onChange={(e) => setCurrentRequest({...currentRequest, full_name: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={currentRequest.phone}
                                    onChange={(e) => setCurrentRequest({...currentRequest, phone: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={currentRequest.email}
                                    onChange={(e) => setCurrentRequest({...currentRequest, email: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="emirate">Emirate</label>
                                <select
                                    id="emirate"
                                    value={currentRequest.emirate}
                                    onChange={(e) => setCurrentRequest({...currentRequest, emirate: e.target.value})}
                                    className={styles.formInput}
                                >
                                    <option value="Dubai">Dubai</option>
                                    <option value="Abu Dhabi">Abu Dhabi</option>
                                    <option value="Sharjah">Sharjah</option>
                                    <option value="Ajman">Ajman</option>
                                    <option value="Fujairah">Fujairah</option>
                                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={currentRequest.address}
                                    onChange={(e) => setCurrentRequest({...currentRequest, address: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="propertyType">Property Type</label>
                                <select
                                    id="propertyType"
                                    value={currentRequest.property_type}
                                    onChange={(e) => setCurrentRequest({...currentRequest, property_type: e.target.value})}
                                    className={styles.formInput}
                                >
                                    <option value="Apartment">Apartment</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Office">Office</option>
                                    <option value="Shop">Shop</option>
                                    <option value="Warehouse">Warehouse</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Services</label>
                            <div className={styles.checkboxGroup}>
                                {['AC Services', 'Electrical Work', 'Plumbing', 'Home Renovation', 'Handyman Services', 'Painting & Decor', 'Fit-Out Works', 'Pool & Tank Services'].map(service => (
                                    <label key={service} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={currentRequest.services.includes(service)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCurrentRequest({
                                                        ...currentRequest,
                                                        services: [...currentRequest.services, service]
                                                    });
                                                } else {
                                                    setCurrentRequest({
                                                        ...currentRequest,
                                                        services: currentRequest.services.filter(s => s !== service)
                                                    });
                                                }
                                            }}
                                        />
                                        <span>{service}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="preferredDate">Preferred Date</label>
                                <input
                                    id="preferredDate"
                                    type="date"
                                    value={currentRequest.preferred_date}
                                    onChange={(e) => setCurrentRequest({...currentRequest, preferred_date: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="preferredTime">Preferred Time</label>
                                <input
                                    id="preferredTime"
                                    type="time"
                                    value={currentRequest.preferred_time}
                                    onChange={(e) => setCurrentRequest({...currentRequest, preferred_time: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="urgency">Urgency</label>
                                <select
                                    id="urgency"
                                    value={currentRequest.urgency}
                                    onChange={(e) => setCurrentRequest({...currentRequest, urgency: e.target.value})}
                                    className={styles.formInput}
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="assignedTo">Assigned To</label>
                                <select
                                    id="assignedTo"
                                    value={currentRequest.assigned_to || ''}
                                    onChange={(e) => setCurrentRequest({...currentRequest, assigned_to: e.target.value})}
                                    className={styles.formInput}
                                >
                                    <option value="">Unassigned</option>
                                    {technicians.map(tech => (
                                        <option key={tech.id} value={tech.name}>{tech.name} ({tech.specialty})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={currentRequest.description}
                                onChange={(e) => setCurrentRequest({...currentRequest, description: e.target.value})}
                                className={styles.formTextArea}
                                rows={3}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="additionalNotes">Additional Notes</label>
                            <textarea
                                id="additionalNotes"
                                value={currentRequest.additional_notes}
                                onChange={(e) => setCurrentRequest({...currentRequest, additional_notes: e.target.value})}
                                className={styles.formTextArea}
                                rows={3}
                            />
                        </div>
                        
                        <div className={styles.modalActions}>
                            <button 
                                onClick={saveRequest}
                                className={styles.saveButton}
                            >
                                {currentRequest.id === 0 ? 'Create Request' : 'Update Request'}
                            </button>
                            <button 
                                onClick={() => setShowRequestModal(false)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
