"use client";

import { useState, useEffect, useCallback } from 'react';
import { NetworkChecker, NetworkCheckResult } from '~/lib/network-checker';

export function useNetworkChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<NetworkCheckResult[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const checkNetworks = useCallback(async () => {
    setIsChecking(true);
    setErrors([]);
    
    try {
      const networkResults = await NetworkChecker.checkAllNetworks();
      setResults(networkResults);
      
      const mainnetErrors: string[] = [];
      for (const result of networkResults) {
        if (result.walletType !== 'none' && !result.isMainnet) {
          mainnetErrors.push(result.error || `Invalid network: ${result.networkName}`);
        }
      }
      
      setErrors(mainnetErrors);
      setIsValid(mainnetErrors.length === 0);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unknown error']);
      setIsValid(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const validateMainnetOnly = useCallback(async () => {
    setIsChecking(true);
    
    try {
      const validation = await NetworkChecker.validateMainnetOnly();
      setIsValid(validation.isValid);
      setErrors(validation.errors);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unknown error']);
      setIsValid(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const cleanup = NetworkChecker.setupNetworkChangeListeners();
    return cleanup;
  }, []);

  useEffect(() => {
    checkNetworks();
  }, [checkNetworks]);

  return {
    isChecking,
    results,
    errors,
    isValid,
    checkNetworks,
    validateMainnetOnly
  };
}
