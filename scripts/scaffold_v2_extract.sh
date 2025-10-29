#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

script_name="${0##*/}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Default paths
SCAFFOLD_V1_ZIP="${SCAFFOLD_V1_ZIP:-./diatonic_monorepo_scaffold.zip}"
SCAFFOLD_V2_ZIP="${SCAFFOLD_V2_ZIP:-./diatonic_monorepo_next_scaffold.zip}"
BACKUP_DIR="${BACKUP_DIR:-./.backup/$TIMESTAMP}"
STAGING_DIR="${STAGING_DIR:-./.staging}"
REPORTS_DIR="./reports/$TIMESTAMP"
LOGS_DIR="./logs"
LOG_FILE="$LOGS_DIR/scaffold_setup_$TIMESTAMP.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Cleanup on exit
cleanup() {
    if [[ -d "$STAGING_DIR" ]]; then
        echo -e "${YELLOW}[cleanup] Removing staging directory${NC}"
        rm -rf "$STAGING_DIR"
    fi
}
trap cleanup EXIT

# Logging function
log() {
    local msg="[$(date +'%Y-%m-%d %H:%M:%S')] $*"
    echo -e "$msg" | tee -a "$LOG_FILE"
}

# Error handler
error() {
    log "${RED}ERROR: $*${NC}"
    exit 1
}

# Create directory structure
create_directories() {
    log "${CYAN}Creating directory structure...${NC}"
    mkdir -p "$BACKUP_DIR" "$STAGING_DIR" "$REPORTS_DIR" "$LOGS_DIR"
    log "${GREEN}✓ Directories created${NC}"
}

# Pre-flight checks
preflight_checks() {
    log "${CYAN}Running pre-flight checks...${NC}"
    
    # Check if zip files exist
    if [[ ! -f "$SCAFFOLD_V1_ZIP" ]]; then
        error "Scaffold v1 zip not found: $SCAFFOLD_V1_ZIP"
    fi
    log "${GREEN}✓ Found v1 scaffold: $SCAFFOLD_V1_ZIP${NC}"
    
    if [[ ! -f "$SCAFFOLD_V2_ZIP" ]]; then
        error "Scaffold v2 zip not found: $SCAFFOLD_V2_ZIP"
    fi
    log "${GREEN}✓ Found v2 scaffold: $SCAFFOLD_V2_ZIP${NC}"
    
    # Check if unzip is available
    if ! command -v unzip &> /dev/null; then
        error "unzip command not found. Please install: sudo apt-get install unzip"
    fi
    log "${GREEN}✓ unzip available${NC}"
    
    log "${GREEN}✓ Pre-flight checks passed${NC}"
}

# Extract scaffold archives
extract_scaffolds() {
    log "${CYAN}Extracting scaffold archives...${NC}"
    
    # Extract v1
    log "Extracting v1 scaffold..."
    mkdir -p "$STAGING_DIR/v1"
    unzip -q "$SCAFFOLD_V1_ZIP" -d "$STAGING_DIR/v1" || error "Failed to extract v1 scaffold"
    log "${GREEN}✓ v1 scaffold extracted to $STAGING_DIR/v1${NC}"
    
    # Extract v2
    log "Extracting v2 scaffold..."
    mkdir -p "$STAGING_DIR/v2"
    unzip -q "$SCAFFOLD_V2_ZIP" -d "$STAGING_DIR/v2" || error "Failed to extract v2 scaffold"
    log "${GREEN}✓ v2 scaffold extracted to $STAGING_DIR/v2${NC}"
}

# Analyze directory structure
analyze_structure() {
    log "${CYAN}Analyzing directory structure...${NC}"
    
    local report_file="$REPORTS_DIR/structure_analysis.md"
    
    cat > "$report_file" <<EOF
# Scaffold Structure Analysis
Generated: $(date)

## V1 Scaffold Contents
\`\`\`
$(cd "$STAGING_DIR/v1" && find . -type f | sort)
\`\`\`

## V2 Scaffold Contents
\`\`\`
$(cd "$STAGING_DIR/v2" && find . -type f | sort)
\`\`\`

## Overlap Analysis
EOF
    
    # Find overlapping files
    log "Checking for overlapping files..."
    local v1_files="$STAGING_DIR/v1_files.txt"
    local v2_files="$STAGING_DIR/v2_files.txt"
    
    (cd "$STAGING_DIR/v1" && find . -type f | sort) > "$v1_files"
    (cd "$STAGING_DIR/v2" && find . -type f | sort) > "$v2_files"
    
    local overlaps=$(comm -12 "$v1_files" "$v2_files")
    
    if [[ -n "$overlaps" ]]; then
        log "${YELLOW}⚠ Found overlapping files:${NC}"
        echo "$overlaps" | while read -r file; do
            log "  - $file"
        done
        
        echo "" >> "$report_file"
        echo "### Overlapping Files" >> "$report_file"
        echo '```' >> "$report_file"
        echo "$overlaps" >> "$report_file"
        echo '```' >> "$report_file"
    else
        log "${GREEN}✓ No overlapping files found${NC}"
        echo "No overlapping files." >> "$report_file"
    fi
    
    log "${GREEN}✓ Structure analysis saved to $report_file${NC}"
}

# Backup existing directories
backup_existing() {
    log "${CYAN}Backing up existing directories...${NC}"
    
    local dirs_to_backup=("frontend" "electron" "backend" "ai" "shared")
    local backed_up=0
    
    for dir in "${dirs_to_backup[@]}"; do
        if [[ -d "./$dir" ]]; then
            log "Backing up $dir..."
            mkdir -p "$BACKUP_DIR"
            cp -a "./$dir" "$BACKUP_DIR/" || error "Failed to backup $dir"
            backed_up=$((backed_up + 1))
        fi
    done
    
    if [[ $backed_up -gt 0 ]]; then
        log "${GREEN}✓ Backed up $backed_up directories to $BACKUP_DIR${NC}"
    else
        log "${YELLOW}⚠ No existing directories to backup${NC}"
    fi
}

# Merge scaffolds
merge_scaffolds() {
    log "${CYAN}Merging scaffolds...${NC}"
    
    local merge_report="$REPORTS_DIR/merge_report.md"
    
    cat > "$merge_report" <<EOF
# Scaffold Merge Report
Generated: $(date)
Backup Location: $BACKUP_DIR

## Merge Strategy
1. Copy v1 scaffold (base structure)
2. Overlay v2 scaffold (overwrites conflicts)

## Files Processed
EOF
    
    # Merge v1 first (base)
    log "Applying v1 scaffold..."
    if [[ -d "$STAGING_DIR/v1" ]]; then
        rsync -av "$STAGING_DIR/v1/" ./ \
            --exclude='.git' \
            --exclude='.backup' \
            --exclude='.staging' \
            --exclude='reports' \
            --exclude='logs' \
            | tee -a "$LOG_FILE"
    fi
    log "${GREEN}✓ v1 scaffold applied${NC}"
    
    # Overlay v2 (overwrites)
    log "Applying v2 scaffold..."
    if [[ -d "$STAGING_DIR/v2" ]]; then
        rsync -av "$STAGING_DIR/v2/" ./ \
            --exclude='.git' \
            --exclude='.backup' \
            --exclude='.staging' \
            --exclude='reports' \
            --exclude='logs' \
            | tee -a "$LOG_FILE"
    fi
    log "${GREEN}✓ v2 scaffold applied${NC}"
    
    # List new/updated directories
    echo "" >> "$merge_report"
    echo "## New/Updated Directories" >> "$merge_report"
    echo '```' >> "$merge_report"
    for dir in frontend electron backend ai shared; do
        if [[ -d "./$dir" ]]; then
            echo "$dir/" >> "$merge_report"
        fi
    done
    echo '```' >> "$merge_report"
    
    log "${GREEN}✓ Merge completed. Report saved to $merge_report${NC}"
}

# Install dependencies
install_dependencies() {
    log "${CYAN}Installing dependencies...${NC}"
    
    # Frontend (Next.js)
    if [[ -d "./frontend" && -f "./frontend/package.json" ]]; then
        log "Installing frontend dependencies..."
        (cd ./frontend && npm install 2>&1 | tee -a "$LOG_FILE") || log "${YELLOW}⚠ Frontend npm install failed${NC}"
    fi
    
    # Electron
    if [[ -d "./electron" && -f "./electron/package.json" ]]; then
        log "Installing Electron dependencies..."
        (cd ./electron && npm install 2>&1 | tee -a "$LOG_FILE") || log "${YELLOW}⚠ Electron npm install failed${NC}"
    fi
    
    # AI/ML (Python)
    if [[ -d "./ai" && -f "./ai/requirements.txt" ]]; then
        log "Setting up AI/ML Python environment..."
        if ! [[ -d "./ai/.venv" ]]; then
            (cd ./ai && python3 -m venv .venv 2>&1 | tee -a "$LOG_FILE") || log "${YELLOW}⚠ Python venv creation failed${NC}"
        fi
        log "${YELLOW}Note: Run 'cd ai && source .venv/bin/activate && pip install -r requirements.txt' manually${NC}"
    fi
    
    log "${GREEN}✓ Dependency installation completed${NC}"
}

# Generate final report
generate_final_report() {
    log "${CYAN}Generating final status report...${NC}"
    
    local final_report="$REPORTS_DIR/final_status.md"
    
    cat > "$final_report" <<EOF
# Scaffold v2 Setup - Final Status Report
Generated: $(date)

## Summary
- **Backup Location**: \`$BACKUP_DIR\`
- **Log File**: \`$LOG_FILE\`
- **Reports Directory**: \`$REPORTS_DIR\`

## Directory Structure
\`\`\`
$(tree -L 2 -d . | head -50 || find . -maxdepth 2 -type d | head -50)
\`\`\`

## Services Available
EOF
    
    # Check which services exist
    [[ -d "./frontend" ]] && echo "- ✅ Frontend (Next.js)" >> "$final_report"
    [[ -d "./electron" ]] && echo "- ✅ Electron" >> "$final_report"
    [[ -d "./backend" ]] && echo "- ✅ Backend (Rust)" >> "$final_report"
    [[ -d "./ai" ]] && echo "- ✅ AI/ML (FastAPI)" >> "$final_report"
    [[ -d "./shared" ]] && echo "- ✅ Shared utilities" >> "$final_report"
    
    cat >> "$final_report" <<EOF

## Next Steps
1. Review merge report: \`$REPORTS_DIR/merge_report.md\`
2. Start frontend: \`cd frontend && npm run dev\`
3. Start Electron: \`cd electron && npm run dev\`
4. Start AI service: \`cd ai && source .venv/bin/activate && uvicorn api.main:app --reload\`

## Rollback Instructions
If you need to rollback:
\`\`\`bash
rsync -av $BACKUP_DIR/ ./ --exclude='.backup'
rm -rf .staging reports/$TIMESTAMP
\`\`\`

## Success Criteria
EOF
    
    # Check success criteria
    local all_good=true
    
    if [[ -d "./frontend" ]]; then
        echo "- ✅ Frontend directory created" >> "$final_report"
    else
        echo "- ❌ Frontend directory missing" >> "$final_report"
        all_good=false
    fi
    
    if [[ -f "$REPORTS_DIR/merge_report.md" ]]; then
        echo "- ✅ Merge report generated" >> "$final_report"
    else
        echo "- ❌ Merge report missing" >> "$final_report"
        all_good=false
    fi
    
    if [[ -d "$BACKUP_DIR" ]]; then
        echo "- ✅ Backup created" >> "$final_report"
    else
        echo "- ❌ Backup missing" >> "$final_report"
        all_good=false
    fi
    
    if $all_good; then
        echo "" >> "$final_report"
        echo "## 🎉 Setup Completed Successfully!" >> "$final_report"
        log "${GREEN}✓ Final report saved to $final_report${NC}"
    else
        echo "" >> "$final_report"
        echo "## ⚠️ Setup completed with warnings" >> "$final_report"
        log "${YELLOW}⚠ Final report saved to $final_report${NC}"
    fi
    
    # Display final report
    cat "$final_report"
}

# Main execution
main() {
    log "${BLUE}======================================${NC}"
    log "${BLUE}  Diatonic Monorepo v2 Scaffold Setup${NC}"
    log "${BLUE}======================================${NC}"
    log ""
    
    create_directories
    preflight_checks
    extract_scaffolds
    analyze_structure
    backup_existing
    merge_scaffolds
    install_dependencies
    generate_final_report
    
    log ""
    log "${GREEN}✨ Scaffold setup completed successfully!${NC}"
    log "${CYAN}📊 Check the reports in: $REPORTS_DIR${NC}"
    log "${CYAN}📝 Full log available at: $LOG_FILE${NC}"
}

main "$@"
