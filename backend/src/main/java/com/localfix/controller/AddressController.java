package com.localfix.controller;

import com.localfix.model.UserAddress;
import com.localfix.repository.UserAddressRepository;
import com.localfix.repository.UserRepository;
import com.localfix.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/addresses")
public class AddressController {

    @Autowired
    private UserAddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<UserAddress>> getAddresses(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(addressRepository.findByUserIdOrderByIsDefaultDesc(currentUser.getId()));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<UserAddress> saveAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserAddress address
    ) {
        address.setUser(userRepository.findById(currentUser.getId()).orElseThrow());
        if (address.isDefault()) {
            List<UserAddress> existing = addressRepository.findByUserIdOrderByIsDefaultDesc(currentUser.getId());
            for (UserAddress a : existing) {
                a.setDefault(false);
                addressRepository.save(a);
            }
        }
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
