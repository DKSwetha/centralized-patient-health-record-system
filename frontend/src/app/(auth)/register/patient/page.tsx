'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'

export default function PatientRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username:       '',
    email:          '',
    password:       '',
    full_name:      '',
    dob:            '',
    gender:         '',
    contact_number: '',
    aadhaar_number: '',
  })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register/patient/', form)
      setSuccess(`Registered successfully! Please login.`)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([field, errors]) => {
            const fieldName = field.replace(/_/g, ' ')
            return `${fieldName}: ${(errors as string[]).join(', ')}`
          })
          .join('\n')
        setError(messages)
      } else {
        setError('Registration failed. Make sure the server is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Patient Registration</h2>

        {error && (
          <pre style={styles.error}>{error}</pre>
        )}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Username</label>
            <input name="username" type="text" value={form.username}
              onChange={handleChange} required style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} required style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} required style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Full Name</label>
            <input name="full_name" type="text" value={form.full_name}
              onChange={handleChange} required style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Date of Birth</label>
            <input name="dob" type="date" value={form.dob}
              onChange={handleChange} required style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Gender</label>
            <select name="gender" value={form.gender}
              onChange={handleChange} required style={styles.input}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Contact Number</label>
            <input name="contact_number" type="tel" value={form.contact_number}
              onChange={handleChange} required style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Aadhaar Number</label>
            <input
              name="aadhaar_number"
              type="text"
              value={form.aadhaar_number}
              onChange={handleChange}
              required
              maxLength={12}
              placeholder="Enter 12-digit Aadhaar number"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 16px' },
  card:      { background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '480px' },
  title:     { marginBottom: '20px', textAlign: 'center', fontSize: '22px', fontWeight: 500 },
  form:      { display: 'flex', flexDirection: 'column', gap: '14px' },
  label:     { fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' },
  input:     { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
  button:    { padding: '10px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', marginTop: '8px' },
  error:     { color: '#b91c1c', fontSize: '13px', marginBottom: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '10px', whiteSpace: 'pre-wrap' },
  success:   { color: '#15803d', fontSize: '13px', marginBottom: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '10px' },
  footer:    { textAlign: 'center', marginTop: '16px', fontSize: '13px' },
  hint:      { fontSize: '12px', color: '#888', marginTop: '3px', display: 'block' },
}
