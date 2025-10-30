import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Addresses() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/account/addresses');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/addresses?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses);
      } else {
        setError(data.error || 'Failed to load addresses');
      }
    } catch (err) {
      setError('Error loading addresses');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      const url = editingAddress ? '/api/user/addresses' : '/api/user/addresses';
      const method = editingAddress ? 'PUT' : 'POST';

      const body = editingAddress
        ? { addressId: editingAddress.id, addressData: data }
        : { userId: user.id, addressData: data };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await fetchAddresses();
        setShowForm(false);
        setEditingAddress(null);
        reset();
      } else {
        setError(result.error || 'Failed to save address');
      }
    } catch (err) {
      setError('Error saving address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    reset(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/addresses?addressId=${addressId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchAddresses();
      } else {
        setError(result.error || 'Failed to delete address');
      }
    } catch (err) {
      setError('Error deleting address');
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    reset({
      label: 'Home',
      fullName: `${user.firstName} ${user.lastName}`,
      addressLine1: '',
      addressLine2: '',
      city: '',
      postcode: '',
      country: 'United Kingdom',
      phone: user.phone || '',
      isDefault: false,
    });
    setShowForm(true);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/account"
              className="text-luxury-600 hover:text-luxury-700 font-medium mb-4 inline-block"
            >
              ← Back to Account
            </Link>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Saved Addresses
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your delivery addresses
            </p>
          </div>
          {!showForm && (
            <button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Address
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label
                  </label>
                  <select {...register('label')} className="input-field">
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Name is required' })}
                    className="input-field"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  {...register('addressLine1', { required: 'Address is required' })}
                  className="input-field"
                  placeholder="Street address"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  {...register('addressLine2')}
                  className="input-field"
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="input-field"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    {...register('postcode', { required: 'Postcode is required' })}
                    className="input-field"
                  />
                  {errors.postcode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    className="input-field"
                    defaultValue="United Kingdom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field"
                  placeholder="+44 20 1234 5678"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isDefault"
                  type="checkbox"
                  {...register('isDefault')}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-luxury-300"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                    reset();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading addresses...</p>
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              No saved addresses
            </h3>
            <p className="text-gray-600 mb-6">
              Add an address for faster checkout
            </p>
            <button onClick={handleAddNew} className="btn-primary inline-flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-xl shadow-sm p-6 relative"
              >
                {address.isDefault && (
                  <span className="absolute top-4 right-4 bg-luxury-100 text-luxury-700 text-xs font-medium px-2 py-1 rounded">
                    Default
                  </span>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-luxury-50 p-2 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-luxury-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">{address.label}</p>
                    <p className="text-gray-700">{address.fullName}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {address.addressLine1}
                      {address.addressLine2 && <><br />{address.addressLine2}</>}
                      <br />
                      {address.city}, {address.postcode}
                      <br />
                      {address.country}
                    </p>
                    {address.phone && (
                      <p className="text-gray-600 text-sm mt-2">
                        Phone: {address.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Saved Addresses',
        description: 'Manage your delivery addresses for faster checkout at GirlSecret UK.',
        path: '/account/addresses',
      },
    },
  };
}
