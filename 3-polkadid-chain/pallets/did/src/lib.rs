//! # Template Pallet
//!
//! A pallet with minimal functionality to help developers understand the essential components of
//! writing a FRAME pallet. It is typically used in beginner tutorials or in Substrate template
//! nodes as a starting point for creating a new pallet and **not meant to be used in production**.
//!
//! ## Overview
//!
//! This template pallet contains basic examples of:
//! - declaring a storage item that stores a single `u32` value
//! - declaring and using events
//! - declaring and using errors
//! - a dispatchable function that allows a user to set a new value to storage and emits an event
//!   upon success
//! - another dispatchable function that causes a custom error to be thrown
//!
//! Each pallet section is annotated with an attribute using the `#[pallet::...]` procedural macro.
//! This macro generates the necessary code for a pallet to be aggregated into a FRAME runtime.
//!
//! Learn more about FRAME macros [here](https://docs.substrate.io/reference/frame-macros/).
//!
//! ### Pallet Sections
//!
//! The pallet sections in this template are:
//!
//! - A **configuration trait** that defines the types and parameters which the pallet depends on
//!   (denoted by the `#[pallet::config]` attribute). See: [`Config`].
//! - A **means to store pallet-specific data** (denoted by the `#[pallet::storage]` attribute).
//!   See: [`storage_types`].
//! - A **declaration of the events** this pallet emits (denoted by the `#[pallet::event]`
//!   attribute). See: [`Event`].
//! - A **declaration of the errors** that this pallet can throw (denoted by the `#[pallet::error]`
//!   attribute). See: [`Error`].
//! - A **set of dispatchable functions** that define the pallet's functionality (denoted by the
//!   `#[pallet::call]` attribute). See: [`dispatchables`].
//!
//! Run `cargo doc --package pallet-template --open` to view this pallet's documentation.

// We make sure this pallet uses `no_std` for compiling to Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

// Re-export pallet items so that they can be accessed from the crate namespace.
pub use pallet::*;

// FRAME pallets require their own "mock runtimes" to be able to run unit tests. This module
// contains a mock runtime specific for testing this pallet's functionality.
#[cfg(test)]
mod mock;

// This module contains the unit tests for this pallet.
// Learn about pallet unit testing here: https://docs.substrate.io/test/unit-testing/
#[cfg(test)]
mod tests;

// Every callable function or "dispatchable" a pallet exposes must have weight values that correctly
// estimate a dispatchable's execution time. The benchmarking module is used to calculate weights
// for each dispatchable and generates this pallet's weight.rs file. Learn more about benchmarking here: https://docs.substrate.io/test/benchmark/
#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

// All pallet logic is defined in its own module and must be annotated by the `pallet` attribute.
#[frame_support::pallet]
pub mod pallet {
	// Import various useful types required by all FRAME pallets.
	use super::*;
	use frame_support::{pallet_prelude::*, traits::Currency};
	use frame_system::pallet_prelude::*;
	use sp_std::prelude::*;

	// The `Pallet` struct serves as a placeholder to implement traits, methods and dispatchables
	// (`Call`s) in this pallet.
	#[pallet::pallet]
	pub struct Pallet<T>(_);

	/// The pallet's configuration trait.
	///
	/// All our types and constants a pallet depends on must be declared here.
	/// These types are defined generically and made concrete when the pallet is declared in the
	/// `runtime/src/lib.rs` file of your chain.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// The overarching runtime event type.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		type Currency: Currency<Self::AccountId>;
		/// A type representing the weights required by the dispatchables of this pallet.
		type WeightInfo: WeightInfo;
	}

	/// A storage item for this pallet.
	///
	/// In this template, we are declaring a storage item called `Something` that stores a single
	/// `u32` value. Learn more about runtime storage here: <https://docs.substrate.io/build/runtime-storage/>
	#[pallet::storage]
	#[pallet::getter(fn dids)]
	pub type DIDs<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, DIDDocument, OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn credentials)]
	pub type Credentials<T: Config> = StorageDoubleMap<
		_,
		Blake2_128Concat, T::AccountId,
		Blake2_128Concat, Vec<u8>,
		VerifiableCredential<T>,
		OptionQuery
	>;

	/// Events that functions in this pallet can emit.
	///
	/// Events are a simple means of indicating to the outside world (such as dApps, chain explorers
	/// or other users) that some notable update in the runtime has occurred. In a FRAME pallet, the
	/// documentation for each event field and its parameters is added to a node's metadata so it
	/// can be used by external interfaces or tools.
	///
	///	The `generate_deposit` macro generates a function on `Pallet` called `deposit_event` which
	/// will convert the event type of your pallet into `RuntimeEvent` (declared in the pallet's
	/// [`Config`] trait) and deposit it using [`frame_system::Pallet::deposit_event`].
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		DIDCreated { who: T::AccountId },
		DIDUpdated { who: T::AccountId },
		DIDDeleted { who: T::AccountId },
		CredentialIssued { issuer: T::AccountId, subject: T::AccountId, credential_id: Vec<u8> },
		CredentialRevoked { issuer: T::AccountId, subject: T::AccountId, credential_id: Vec<u8> },
	}

	/// Errors that can be returned by this pallet.
	///
	/// Errors tell users that something went wrong so it's important that their naming is
	/// informative. Similar to events, error documentation is added to a node's metadata so it's
	/// equally important that they have helpful documentation associated with them.
	///
	/// This type of runtime error can be up to 4 bytes in size should you want to return additional
	/// information.
	#[pallet::error]
	pub enum Error<T> {
		DIDAlreadyExists,
		DIDNotFound,
		NotAuthorized,
		CredentialNotFound,
	}

	/// The pallet's dispatchable functions ([`Call`]s).
	///
	/// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	/// These functions materialize as "extrinsics", which are often compared to transactions.
	/// They must always return a `DispatchResult` and be annotated with a weight and call index.
	///
	/// The [`call_index`] macro is used to explicitly
	/// define an index for calls in the [`Call`] enum. This is useful for pallets that may
	/// introduce new dispatchables over time. If the order of a dispatchable changes, its index
	/// will also change which will break backwards compatibility.
	///
	/// The [`weight`] macro is used to assign a weight to each call.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(T::WeightInfo::create_did())]
		pub fn create_did(
			origin: OriginFor<T>,
			public_key: Vec<u8>,
			service_endpoint: Vec<u8>
		) -> DispatchResult {
			let who = ensure_signed(origin)?;
			ensure!(!DIDs::<T>::contains_key(&who), Error::<T>::DIDAlreadyExists);

			let did = DIDDocument {
				did: who.encode(),
				public_key,
				service_endpoint,
			};
			DIDs::<T>::insert(&who, did);
			Self::deposit_event(Event::DIDCreated { who });
			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(T::WeightInfo::update_did())]
		pub fn update_did(
			origin: OriginFor<T>,
			public_key: Vec<u8>,
			service_endpoint: Vec<u8>
		) -> DispatchResult {
			let who = ensure_signed(origin)?;
			DIDs::<T>::try_mutate(&who, |did| -> DispatchResult {
				let did = did.as_mut().ok_or(Error::<T>::DIDNotFound)?;
				did.public_key = public_key;
				did.service_endpoint = service_endpoint;
				Ok(())
			})?;
			Self::deposit_event(Event::DIDUpdated { who });
			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight(T::WeightInfo::delete_did())]
		pub fn delete_did(origin: OriginFor<T>) -> DispatchResult {
			let who = ensure_signed(origin)?;
			DIDs::<T>::take(&who).ok_or(Error::<T>::DIDNotFound)?;
			Self::deposit_event(Event::DIDDeleted { who });
			Ok(())
		}

		#[pallet::call_index(3)]
		#[pallet::weight(T::WeightInfo::issue_credential())]
		pub fn issue_credential(
			origin: OriginFor<T>,
			subject: T::AccountId,
			credential_id: Vec<u8>,
			credential_type: Vec<u8>,
			credential_data: Vec<u8>,
		) -> DispatchResult {
			let issuer = ensure_signed(origin)?;
			ensure!(DIDs::<T>::contains_key(&issuer), Error::<T>::DIDNotFound);
			ensure!(DIDs::<T>::contains_key(&subject), Error::<T>::DIDNotFound);

			let credential = VerifiableCredential {
				issuer: issuer.clone(),
				subject: subject.clone(),
				credential_type,
				credential_data,
			};
			Credentials::<T>::insert(&subject, &credential_id, credential);
			Self::deposit_event(Event::CredentialIssued { issuer, subject, credential_id });
			Ok(())
		}

		#[pallet::call_index(4)]
		#[pallet::weight(T::WeightInfo::revoke_credential())]
		pub fn revoke_credential(
			origin: OriginFor<T>,
			subject: T::AccountId,
			credential_id: Vec<u8>,
		) -> DispatchResult {
			let issuer = ensure_signed(origin)?;
			Credentials::<T>::try_mutate_exists(&subject, &credential_id, |credential| -> DispatchResult {
				let credential = credential.take().ok_or(Error::<T>::CredentialNotFound)?;
				ensure!(credential.issuer == issuer, Error::<T>::NotAuthorized);
				Ok(())
			})?;
			Self::deposit_event(Event::CredentialRevoked { issuer, subject, credential_id });
			Ok(())
		}
	}
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct DIDDocument {
	pub did: Vec<u8>,
	pub public_key: Vec<u8>,
	pub service_endpoint: Vec<u8>,
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct VerifiableCredential<T: Config> {
	pub issuer: T::AccountId,
	pub subject: T::AccountId,
	pub credential_type: Vec<u8>,
	pub credential_data: Vec<u8>,
}

pub trait WeightInfo {
	fn create_did() -> Weight;
	fn update_did() -> Weight;
	fn delete_did() -> Weight;
	fn issue_credential() -> Weight;
	fn revoke_credential() -> Weight;
}