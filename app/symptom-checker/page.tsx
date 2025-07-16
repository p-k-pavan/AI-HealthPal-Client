'use client'

import React, { useState } from 'react'
import { FaBirthdayCake, FaVenusMars, FaStethoscope, FaRedo } from 'react-icons/fa'
import { MdOutlineMedicalServices, MdWarning } from 'react-icons/md'
import axios from 'axios'

type FormData = {
    age: string
    gender: string
    symptom: string
}

type Condition = {
    name: string
    probability: number
    explanation: string
    suggested_medications: string[]
}

type AnalysisResult = {
    age: number
    gender: string
    conditions: Condition[]
    recommendation: string
    disclaimer: string
}

const Page = () => {
    const [formData, setFormData] = useState<FormData>({
        age: "",
        gender: "",
        symptom: ""
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const formatSymptoms = (symptoms: string): string[] => {
        const cleaned = symptoms.trim().replace(/\s+/g, ' ')
        return cleaned.split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const age = parseInt(formData.age)
            if (isNaN(age)) throw new Error('Please enter a valid age')
            if (age < 1 || age > 120) throw new Error('Age must be between 1 and 120')
            if (!['male', 'female', 'other'].includes(formData.gender)) {
                throw new Error('Please select a valid gender')
            }
            if (!formData.symptom.trim()) throw new Error('Please enter at least one symptom')

            const symptomsArray = formatSymptoms(formData.symptom)

            const response = await axios.post<{ result: AnalysisResult }>(
                'http://localhost:5000/api/ai/symptom',
                {
                    age,
                    gender: formData.gender,
                    symptoms: symptomsArray
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            )

            setResult(response.data.result)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during analysis')
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100'>
            <div className='w-full max-w-2xl'>
                {/* Header */}
                <div className='p-6 rounded-t-2xl bg-gradient-to-r from-[#04ced9] to-[#2a7f8f] text-center shadow-lg'>
                    <div className='flex items-center justify-center space-x-3'>
                        <MdOutlineMedicalServices className='text-3xl text-white' />
                        <h1 className='text-2xl md:text-3xl font-bold text-white'>Medical Symptom Analyzer</h1>
                    </div>
                    <p className='mt-2 text-white/90'>Get preliminary analysis of your symptoms</p>
                </div>

                {/* Main Content */}
                <div className='bg-white rounded-b-2xl shadow-xl overflow-hidden'>
                    {!result ? (
                        <div className='p-6 md:p-8'>
                            <form onSubmit={handleSubmit}>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {/* Age Field */}
                                    <div className='relative'>
                                        <label className='block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wider' htmlFor='age'>
                                            Age
                                        </label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                <FaBirthdayCake className='text-gray-400' />
                                            </div>
                                            <input
                                                id='age'
                                                type='number'
                                                placeholder='e.g. 32'
                                                value={formData.age}
                                                onChange={handleChange}
                                                min='1'
                                                max='120'
                                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition bg-gray-50'
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Gender Field */}
                                    <div className='relative'>
                                        <label className='block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wider' htmlFor='gender'>
                                            Gender
                                        </label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                <FaVenusMars className='text-gray-400' />
                                            </div>
                                            <select
                                                id='gender'
                                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent appearance-none transition bg-gray-50'
                                                value={formData.gender}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value=''>Select Gender</option>
                                                <option value='male'>Male</option>
                                                <option value='female'>Female</option>
                                                <option value='other'>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Symptoms Field */}
                                <div className='mt-6'>
                                    <label className='block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wider' htmlFor='symptom'>
                                        Symptoms
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute top-3 left-3'>
                                            <FaStethoscope className='text-gray-400' />
                                        </div>
                                        <textarea
                                            id='symptom'
                                            placeholder='Describe your symptoms in detail (e.g., headache, fever, nausea)'
                                            value={formData.symptom}
                                            onChange={handleChange}
                                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition min-h-[120px] bg-gray-50'
                                            required
                                        />
                                    </div>
                                    <p className='mt-2 text-xs text-gray-500'>
                                        Be as specific as possible. Separate multiple symptoms with commas.
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className='mt-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                                        <MdWarning className='text-red-500 mt-0.5 mr-2 flex-shrink-0' />
                                        <p className='text-red-700 text-sm'>{error}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white transition ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#04ced9] to-[#2a7f8f] hover:from-[#03b8c4] hover:to-[#23707d] shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {loading ? (
                                        <span className='flex items-center justify-center'>
                                            <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                            Analyzing...
                                        </span>
                                    ) : (
                                        'Analyze Symptoms'
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className='p-6 md:p-8'>
                            {/* Results Header */}
                            <div className='flex items-center justify-between mb-6'>
                                <h2 className='text-xl md:text-2xl font-bold text-gray-800 flex items-center'>
                                    <MdOutlineMedicalServices className='mr-2 text-[#04ced9]' />
                                    Analysis Results
                                </h2>
                                <span className='px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full'>
                                    Preliminary
                                </span>
                            </div>

                            {/* Patient Info */}
                            <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2'>Patient Information</h3>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-xs text-gray-500'>Age</p>
                                        <p className='font-medium'>{result.age} years</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Gender</p>
                                        <p className='font-medium capitalize'>{result.gender}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Conditions */}
                            <div className='mb-8'>
                                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4'>Possible Conditions</h3>
                                <div className='space-y-4'>
                                    {result.conditions.map((condition, index) => (
                                        <div key={index} className='border-l-4 border-[#04ced9] pl-4 py-2'>
                                            <div className='flex justify-between items-start'>
                                                <h4 className='font-semibold text-gray-800'>
                                                    {condition.name}
                                                </h4>
                                                <span className='px-2 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full'>
                                                    {(condition.probability * 100).toFixed(0)}% probability
                                                </span>
                                            </div>
                                            <p className='mt-1 text-gray-600 text-sm'>{condition.explanation}</p>
                                            
                                            {condition.suggested_medications.length > 0 && (
                                                <div className='mt-3'>
                                                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Suggested Medications</p>
                                                    <div className='flex flex-wrap gap-2'>
                                                        {condition.suggested_medications.map((med, i) => (
                                                            <span key={i} className='px-2 py-1 bg-green-50 text-green-800 text-xs rounded-full'>
                                                                {med}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className='bg-blue-50 p-4 rounded-lg mb-6'>
                                <h3 className='text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2'>Recommendation</h3>
                                <p className='text-blue-800'>{result.recommendation}</p>
                            </div>

                            {/* Disclaimer */}
                            <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6'>
                                <div className='flex items-start'>
                                    <MdWarning className='text-yellow-500 mt-0.5 mr-2 flex-shrink-0' />
                                    <p className='text-yellow-700 text-xs'>{result.disclaimer}</p>
                                </div>
                            </div>

                            {/* New Analysis Button */}
                            <button
                                onClick={() => {
                                    setResult(null)
                                    setFormData({ age: "", gender: "", symptom: "" })
                                }}
                                className='w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-[#04ced9] to-[#2a7f8f] hover:from-[#03b8c4] hover:to-[#23707d] shadow-md hover:shadow-lg transition flex items-center justify-center'
                            >
                                <FaRedo className='mr-2' />
                                Start New Analysis
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='mt-6 text-center text-xs text-gray-500'>
                    <p>This tool provides preliminary information only and is not a substitute for professional medical advice.</p>
                </div>
            </div>
        </div>
    )
}

export default Page