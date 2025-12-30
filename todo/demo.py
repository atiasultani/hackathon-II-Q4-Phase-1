#!/usr/bin/env python3
"""
Test script to demonstrate all todo application features in a single session.
"""
import sys
import os
# Add the src directory to the path so we can import other modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from src.cli.main import TodoCLI
import argparse


def run_demo():
    """Run a demonstration of all todo application features."""
    print("=== Todo Application Demo ===\n")

    # Create a single CLI instance to maintain in-memory state
    cli = TodoCLI()

    print("1. Adding tasks:")

    # Add first task
    cli.add_task(argparse.Namespace(title="Buy groceries", description="Milk, bread, eggs"))

    # Add second task
    cli.add_task(argparse.Namespace(title="Walk the dog", description="Morning walk in the park"))

    # Add third task
    cli.add_task(argparse.Namespace(title="Finish report", description=None))

    print("\n2. Listing all tasks:")
    cli.list_tasks(None)

    print("\n3. Updating a task:")
    cli.update_task(argparse.Namespace(id=2, title="Walk the dog", description="Morning walk with the golden retriever"))

    print("\n4. Toggling task status:")
    cli.toggle_task(argparse.Namespace(id=1))

    print("\n5. Listing all tasks after updates:")
    cli.list_tasks(None)

    print("\n6. Deleting a task:")
    cli.delete_task(argparse.Namespace(id=3))

    print("\n7. Final task list:")
    cli.list_tasks(None)

    print("\n=== Demo completed successfully! ===")


if __name__ == "__main__":
    run_demo()