// tests.rs
use crate::{mock::*, Error, Event};
use frame_support::{assert_noop, assert_ok};
use sp_runtime::bounded_vec::BoundedVec;

#[test]
fn create_did_works() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;

        // Act
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));

        // Assert
        assert!(Did::did_documents(account_id).is_some());
        System::assert_has_event(Event::DidDocumentCreated {
            did: account_id,
            controller: account_id,
        }.into());
    });
}

#[test]
fn create_did_fails_when_already_exists() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));

        // Act & Assert
        assert_noop!(
            Did::create_did(RuntimeOrigin::signed(account_id)),
            Error::<Test>::DidDocumentAlreadyExists
        );
    });
}

#[test]
fn link_chain_works() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        let chain_name: Vec<u8> = b"ethereum".to_vec();
        let chain_id = 1;
        let address: Vec<u8> = b"0x123456789abcdef".to_vec();
        
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));

        // Act
        assert_ok!(Did::link_chain(
            RuntimeOrigin::signed(account_id),
            chain_name.clone(),
            chain_id,
            address.clone()
        ));

        // Assert
        let document = Did::did_documents(account_id).unwrap();
        assert_eq!(document.chains.len(), 1);
        assert_eq!(document.chains[0].chain_id, chain_id);
        
        System::assert_has_event(Event::ChainLinked {
            did: account_id,
            chain_id,
            address,
        }.into());
    });
}

#[test]
fn link_chain_fails_when_did_not_found() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        let chain_name: Vec<u8> = b"ethereum".to_vec();
        let chain_id = 1;
        let address: Vec<u8> = b"0x123456789abcdef".to_vec();

        // Act & Assert
        assert_noop!(
            Did::link_chain(
                RuntimeOrigin::signed(account_id),
                chain_name,
                chain_id,
                address
            ),
            Error::<Test>::DidDocumentNotFound
        );
    });
}

#[test]
fn link_chain_fails_when_chain_already_linked() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        let chain_name: Vec<u8> = b"ethereum".to_vec();
        let chain_id = 1;
        let address: Vec<u8> = b"0x123456789abcdef".to_vec();
        
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));
        assert_ok!(Did::link_chain(
            RuntimeOrigin::signed(account_id),
            chain_name.clone(),
            chain_id,
            address.clone()
        ));

        // Act & Assert
        assert_noop!(
            Did::link_chain(
                RuntimeOrigin::signed(account_id),
                chain_name,
                chain_id,
                address
            ),
            Error::<Test>::ChainAlreadyLinked
        );
    });
}

#[test]
fn unlink_chain_works() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        let chain_name: Vec<u8> = b"ethereum".to_vec();
        let chain_id = 1;
        let address: Vec<u8> = b"0x123456789abcdef".to_vec();
        
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));
        assert_ok!(Did::link_chain(
            RuntimeOrigin::signed(account_id),
            chain_name,
            chain_id,
            address
        ));

        // Act
        assert_ok!(Did::unlink_chain(RuntimeOrigin::signed(account_id), chain_id));

        // Assert
        let document = Did::did_documents(account_id).unwrap();
        assert_eq!(document.chains.len(), 0);
        
        System::assert_has_event(Event::ChainUnlinked {
            did: account_id,
            chain_id,
        }.into());
    });
}

#[test]
fn unlink_chain_fails_when_chain_not_linked() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        let chain_id = 1;
        
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));

        // Act & Assert
        assert_noop!(
            Did::unlink_chain(RuntimeOrigin::signed(account_id), chain_id),
            Error::<Test>::ChainNotLinked
        );
    });
}

#[test]
fn unlink_chain_fails_when_not_controller() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        let other_account = 2;
        let chain_name: Vec<u8> = b"ethereum".to_vec();
        let chain_id = 1;
        let address: Vec<u8> = b"0x123456789abcdef".to_vec();
        
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));
        assert_ok!(Did::link_chain(
            RuntimeOrigin::signed(account_id),
            chain_name,
            chain_id,
            address
        ));

        // Act & Assert
        assert_noop!(
            Did::unlink_chain(RuntimeOrigin::signed(other_account), chain_id),
            Error::<Test>::DidDocumentNotFound
        );
    });
}

#[test]
fn link_chain_fails_when_too_many_chains() {
    new_test_ext().execute_with(|| {
        // Arrange
        let account_id = 1;
        assert_ok!(Did::create_did(RuntimeOrigin::signed(account_id)));

        // Add maximum number of chains
        for i in 0..MaxLinkedChains::get() {
            let chain_name = format!("chain{}", i).into_bytes();
            let address = format!("address{}", i).into_bytes();
            assert_ok!(Did::link_chain(
                RuntimeOrigin::signed(account_id),
                chain_name,
                i,
                address
            ));
        }

        // Act & Assert
        assert_noop!(
            Did::link_chain(
                RuntimeOrigin::signed(account_id),
                b"onemore".to_vec(),
                MaxLinkedChains::get(),
                b"address".to_vec()
            ),
            Error::<Test>::TooManyLinkedChains
        );
    });
}